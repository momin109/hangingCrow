import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
import { CommissionType } from '@prisma/client';

/**
 * Enhanced Betting Service with production-ready settlement logic
 */
@Injectable()
export class BettingService {
    private readonly logger = new Logger(BettingService.name);

    constructor(
        private prisma: PrismaService,
        private commissionService: CommissionService,
    ) { }

    /**
     * Place a bet with atomic wallet deduction
     */
    async placeBet(betData: {
        userId: string;
        marketId: string;
        selectionId: string;
        odds: number;
        stake: number;
    }) {
        this.logger.log(`Placing bet for user ${betData.userId}, stake: ${betData.stake}`);

        // Validate bet constraints
        if (betData.stake < 10) {
            throw new BadRequestException('Minimum stake is ₹10');
        }
        if (betData.stake > 100000) {
            throw new BadRequestException('Maximum stake is ₹100,000');
        }
        if (betData.odds < 1.01 || betData.odds > 1000) {
            throw new BadRequestException('Invalid odds');
        }

        // Calculate potential win
        const potentialWin = betData.stake * betData.odds;

        // Execute in transaction (atomic)
        return await this.prisma.$transaction(async (tx) => {
            // 1. Check balance
            const wallet = await tx.wallet.findUnique({
                where: { userId: betData.userId },
            });

            if (!wallet || Number(wallet.balance) < betData.stake) {
                throw new BadRequestException('Insufficient balance');
            }

            // 2. Deduct stake from wallet
            await tx.wallet.update({
                where: { userId: betData.userId, version: wallet.version },
                data: {
                    balance: { decrement: betData.stake },
                    version: { increment: 1 },
                },
            });

            // 3. Create bet record
            const user = await tx.user.findUnique({
                where: { id: betData.userId },
            });

            const bet = await tx.bet.create({
                data: {
                    userId: betData.userId,
                    marketId: betData.marketId,
                    selectionId: betData.selectionId,
                    odds: betData.odds,
                    stake: betData.stake,
                    potentialWin,
                    status: 'PENDING',
                    tenantId: user.tenantId,
                },
            });

            this.logger.log(`Bet placed successfully: ${bet.id}`);
            return bet;
        });
    }

    /**
     * Settle a bet as WON/LOST/VOID
     */
    async settleBet(betId: string, result: 'WON' | 'LOST' | 'VOID' | 'HALF_WON' | 'HALF_LOST') {
        this.logger.log(`Settling bet ${betId} as ${result}`);

        return await this.prisma.$transaction(async (tx) => {
            // 1. Get bet details
            const bet = await tx.bet.findUnique({
                where: { id: betId },
                include: { user: true },
            });

            if (!bet) {
                throw new NotFoundException('Bet not found');
            }

            if (bet.status !== 'PENDING') {
                throw new BadRequestException('Bet already settled');
            }

            // 2. Calculate profit/loss
            let payoutAmount = 0;
            let profitLoss = 0;

            switch (result) {
                case 'WON':
                    payoutAmount = Number(bet.potentialWin);
                    profitLoss = Number(bet.potentialWin) - Number(bet.stake);
                    break;
                case 'HALF_WON':
                    payoutAmount = Number(bet.stake) + (Number(bet.potentialWin) - Number(bet.stake)) / 2;
                    profitLoss = payoutAmount - Number(bet.stake);
                    break;
                case 'VOID':
                    payoutAmount = Number(bet.stake); // Return stake
                    profitLoss = 0;
                    break;
                case 'HALF_LOST':
                    payoutAmount = Number(bet.stake) / 2;
                    profitLoss = -Number(bet.stake) / 2;
                    break;
                case 'LOST':
                    payoutAmount = 0;
                    profitLoss = -Number(bet.stake);
                    break;
            }

            // 3. Update bet status
            await tx.bet.update({
                where: { id: betId },
                data: {
                    status: result,
                    settledAt: new Date(),
                },
            });

            // 4. Update user wallet if there's payout
            if (payoutAmount > 0) {
                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: {
                        balance: { increment: payoutAmount },
                    },
                });
            }

            // 5. Create settlement record
            await tx.betSettle.create({
                data: {
                    betId: betId,
                    amount: profitLoss,
                    type: result === 'VOID' ? 'VOID' : result === 'WON' || result === 'HALF_WON' ? 'WIN' : 'LOSS',
                },
            });

            this.logger.log(`Bet ${betId} settled. Payout: ${payoutAmount}`);

            // 6. Trigger commission distribution (async, don't await)
            if (result === 'LOST' || result === 'HALF_LOST') {
                // House made profit, distribute commission
                const houseProfit = Math.abs(profitLoss);
                this.commissionService
                    .distributeCommission(bet.userId, houseProfit, CommissionType.TURNOVER)
                    .catch((error) => {
                        this.logger.error(`Commission distribution failed for bet ${betId}:`, error);
                    });
            }

            return {
                bet,
                payout: payoutAmount,
                profitLoss,
            };
        });
    }

    /**
     * Get bet history with pagination
     */
    async getBetHistory(userId: string, filters?: { status?: string; limit?: number; offset?: number }) {
        const where: any = { userId };
        if (filters?.status) {
            where.status = filters.status;
        }

        const limit = filters?.limit || 50;
        const offset = filters?.offset || 0;

        const [bets, total] = await Promise.all([
            this.prisma.bet.findMany({
                where,
                orderBy: { placedAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.bet.count({ where }),
        ]);

        return {
            data: bets,
            total,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get live (pending) bets
     */
    async getLiveBets(tenantId?: string) {
        const where: any = { status: 'PENDING' };
        if (tenantId) {
            where.tenantId = tenantId;
        }

        return await this.prisma.bet.findMany({
            where,
            include: {
                user: {
                    select: {
                        username: true,
                        role: true,
                    },
                },
            },
            orderBy: { placedAt: 'desc' },
            take: 100,
        });
    }

    /**
     * Get top players (risk management)
     */
    async getTopPlayers(limit: number = 10) {
        const result = await this.prisma.bet.groupBy({
            by: ['userId'],
            where: {
                status: 'PENDING',
            },
            _sum: {
                stake: true,
                potentialWin: true,
            },
            orderBy: {
                _sum: {
                    potentialWin: 'desc',
                },
            },
            take: limit,
        });

        // Enrich with user data
        const enriched = await Promise.all(
            result.map(async (item) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: item.userId },
                    select: { username: true, role: true },
                });
                return {
                    ...user,
                    userId: item.userId,
                    totalStake: Number(item._sum.stake || 0),
                    totalExposure: Number(item._sum.potentialWin || 0),
                };
            }),
        );

        return enriched;
    }

    /**
     * Get user's total exposure (pending bets)
     */
    async getUserExposure(userId: string) {
        const result = await this.prisma.bet.aggregate({
            where: {
                userId,
                status: 'PENDING',
            },
            _sum: {
                stake: true,
                potentialWin: true,
            },
            _count: true,
        });

        return {
            pendingBets: result._count,
            totalStake: Number(result._sum.stake || 0),
            totalExposure: Number(result._sum.potentialWin || 0),
        };
    }
}
