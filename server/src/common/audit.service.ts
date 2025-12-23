import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Audit Service
 * Provides immutable logging for all critical actions
 * These logs cannot be modified or deleted
 */
@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Log an action (immutable)
     */
    async log(
        action: string,
        userId: string,
        options?: {
            targetId?: string;
            targetType?: string;
            ipAddress?: string;
            deviceHash?: string;
            meta?: Record<string, any>;
        },
    ): Promise<void> {
        try {
            await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    targetId: options?.targetId,
                    targetType: options?.targetType,
                    ipAddress: options?.ipAddress,
                    deviceHash: options?.deviceHash,
                    meta: options?.meta || {},
                },
            });
        } catch (error) {
            // Never let audit logging failure affect main operation
            this.logger.error(`Audit log failed: ${error.message}`);
        }
    }

    /**
     * Log login event
     */
    async logLogin(
        userId: string,
        ipAddress?: string,
        deviceHash?: string,
        success = true,
    ): Promise<void> {
        await this.log(success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED', userId, {
            ipAddress,
            deviceHash,
            meta: { timestamp: new Date().toISOString() },
        });
    }

    /**
     * Log bet placement
     */
    async logBetPlace(
        userId: string,
        betId: string,
        stake: number,
        odds: number,
        ipAddress?: string,
    ): Promise<void> {
        await this.log('BET_PLACE', userId, {
            targetId: betId,
            targetType: 'BET',
            ipAddress,
            meta: { stake, odds },
        });
    }

    /**
     * Log bet settlement
     */
    async logBetSettle(
        userId: string,
        betId: string,
        result: string,
        payout: number,
    ): Promise<void> {
        await this.log('BET_SETTLE', userId, {
            targetId: betId,
            targetType: 'BET',
            meta: { result, payout },
        });
    }

    /**
     * Log wallet update
     */
    async logWalletUpdate(
        userId: string,
        walletId: string,
        amount: number,
        type: 'CREDIT' | 'DEBIT',
        reason: string,
    ): Promise<void> {
        await this.log('WALLET_UPDATE', userId, {
            targetId: walletId,
            targetType: 'WALLET',
            meta: { amount, type, reason },
        });
    }

    /**
     * Get audit logs for a user
     */
    async getUserLogs(
        userId: string,
        limit = 50,
        offset = 0,
    ): Promise<{ data: any[]; total: number }> {
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.auditLog.count({ where: { userId } }),
        ]);

        return { data: logs, total };
    }

    /**
     * Get logs by action type
     */
    async getLogsByAction(
        action: string,
        limit = 50,
        offset = 0,
    ): Promise<{ data: any[]; total: number }> {
        const [logs, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where: { action },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.auditLog.count({ where: { action } }),
        ]);

        return { data: logs, total };
    }

    /**
     * Get recent logs (for admin dashboard)
     */
    async getRecentLogs(limit = 100): Promise<any[]> {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
