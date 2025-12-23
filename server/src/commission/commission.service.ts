import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionType, Role } from '@prisma/client';

/**
 * Commission Service - Handles commission distribution up the hierarchy
 */
@Injectable()
export class CommissionService {
    private readonly logger = new Logger(CommissionService.name);

    // Commission rates by role (configurable via env or database)
    private readonly COMMISSION_RATES: Record<Role, number> = {
        AGENT: parseFloat(process.env.AGENT_COMMISSION || '0.05'), // 5%
        MASTER_AGENT: parseFloat(process.env.MASTER_AGENT_COMMISSION || '0.03'), // 3%
        SUPER_AGENT: parseFloat(process.env.SUPER_AGENT_COMMISSION || '0.025'), // 2.5%
        AFFILIATE: parseFloat(process.env.AFFILIATE_COMMISSION || '0.02'), // 2%
        SENIOR_AFFILIATE: parseFloat(process.env.SENIOR_AFFILIATE_COMMISSION || '0.025'), // 2.5%
        B2B_SUBADMIN: parseFloat(process.env.B2B_SUBADMIN_COMMISSION || '0.015'), // 1.5%
        B2C_SUBADMIN: parseFloat(process.env.B2C_SUBADMIN_COMMISSION || '0.015'), // 1.5%
        ADMIN: parseFloat(process.env.ADMIN_COMMISSION || '0.02'), // 2%
        SUPERADMIN: parseFloat(process.env.SUPERADMIN_COMMISSION || '0.015'), // 1.5%
        WHITELABEL: parseFloat(process.env.WHITELABEL_COMMISSION || '0.01'), // 1%
        MOTHER: parseFloat(process.env.MOTHER_COMMISSION || '0.01'), // 1%
        OWNER: parseFloat(process.env.OWNER_COMMISSION || '0.01'), // 1%
        USER: 0, // Users don't earn commission
    };

    constructor(private prisma: PrismaService) { }

    /**
     * Distribute commission up the hierarchy when bet is settled
     */
    async distributeCommission(
        sourceUserId: string,
        amount: number,
        type: CommissionType = CommissionType.TURNOVER,
    ): Promise<void> {
        this.logger.log(`Distributing commission for user ${sourceUserId}, amount: ${amount}`);

        try {
            // Get source user
            const sourceUser = await this.prisma.user.findUnique({
                where: { id: sourceUserId },
                include: { parent: true },
            });

            if (!sourceUser) {
                throw new Error(`Source user not found: ${sourceUserId}`);
            }

            let currentParent = sourceUser.parent;
            let level = 1;

            // Traverse up the hierarchy
            while (currentParent) {
                const commissionRate = this.COMMISSION_RATES[currentParent.role] || 0;
                const commissionAmount = amount * commissionRate;

                if (commissionAmount > 0) {
                    // Create commission transaction and update wallet in single transaction
                    await this.prisma.$transaction(async (tx) => {
                        // Create commission transaction record
                        await tx.commissionTxn.create({
                            data: {
                                userId: currentParent.id,
                                sourceUserId: sourceUserId,
                                amount: commissionAmount,
                                type: type,
                                level: level,
                            },
                        });

                        // Create commission ledger entry for audit trail
                        await tx.commissionLedger.create({
                            data: {
                                userId: currentParent.id,
                                amount: commissionAmount,
                                type: type.toString(),
                                meta: {
                                    sourceUserId,
                                    level,
                                    role: currentParent.role,
                                    distributedAt: new Date().toISOString(),
                                },
                            },
                        });

                        // Update commission balance
                        await tx.wallet.update({
                            where: { userId: currentParent.id },
                            data: {
                                commissionBalance: {
                                    increment: commissionAmount,
                                },
                            },
                        });

                        this.logger.log(
                            `Commission distributed: ${commissionAmount} to ${currentParent.username} (${currentParent.role}) at level ${level}`,
                        );
                    });
                }

                // Move to next parent
                const nextParent = await this.prisma.user.findUnique({
                    where: { id: currentParent.id },
                    include: { parent: true },
                });

                currentParent = nextParent?.parent;
                level++;
            }

            this.logger.log(`Commission distribution completed for ${sourceUserId}`);
        } catch (error) {
            this.logger.error(`Commission distribution failed: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Calculate total commission earned by user
     */
    async getTotalCommission(
        userId: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<number> {
        const where: any = { userId };

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = startDate;
            if (endDate) where.createdAt.lte = endDate;
        }

        const result = await this.prisma.commissionTxn.aggregate({
            where,
            _sum: {
                amount: true,
            },
        });

        return Number(result._sum.amount || 0);
    }

    /**
     * Get commission breakdown by type
     */
    async getCommissionBreakdown(userId: string) {
        const commissions = await this.prisma.commissionTxn.groupBy({
            by: ['type'],
            where: { userId },
            _sum: {
                amount: true,
            },
            _count: true,
        });

        return commissions.map((c) => ({
            type: c.type,
            total: Number(c._sum.amount || 0),
            count: c._count,
        }));
    }

    /**
     * Get commission history for user
     */
    async getCommissionHistory(
        userId: string,
        limit: number = 50,
        offset: number = 0,
    ) {
        const history = await this.prisma.commissionTxn.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const total = await this.prisma.commissionTxn.count({
            where: { userId },
        });

        // Enrich with source user data
        const enriched = await Promise.all(
            history.map(async (txn) => {
                const sourceUser = await this.prisma.user.findUnique({
                    where: { id: txn.sourceUserId },
                    select: {
                        username: true,
                        role: true,
                    },
                });
                return {
                    ...txn,
                    sourceUser,
                };
            }),
        );

        return {
            data: enriched,
            total,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Legacy method for backwards compatibility
     */
    async processCommission(userId: string, amount: number, type: CommissionType) {
        return this.distributeCommission(userId, amount, type);
    }
}
