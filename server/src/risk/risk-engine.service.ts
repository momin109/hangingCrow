import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { AntiCheatService } from 'src/anti-cheat/anti-cheat.service';
import { LockService } from 'src/user/lock.service';
import { AlertService } from 'src/common/alert.service';

/**
 * Risk Engine Service
 * Runs periodic checks for fraud, manipulation, and system integrity
 * Cron job runs every 5 minutes
 */
@Injectable()
export class RiskEngineService {
    private readonly logger = new Logger(RiskEngineService.name);
    private isRunning = false;

    constructor(
        private prisma: PrismaService,
        private antiCheatService: AntiCheatService,
        private lockService: LockService,
        private alertService: AlertService,
    ) { }

    /**
     * Main risk analysis cron job - runs every 5 minutes
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async runRiskAnalysis(): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Risk analysis already running, skipping...');
            return;
        }

        this.isRunning = true;
        this.logger.log('Starting risk analysis...');

        try {
            await Promise.all([
                this.checkPlayerRTPDeviation(),
                this.checkAgentWinRates(),
                this.checkWalletMismatch(),
                this.checkSettlementMismatch(),
                this.checkSuspiciousPatterns(),
            ]);

            this.logger.log('Risk analysis completed');
        } catch (error) {
            this.logger.error(`Risk analysis failed: ${error.message}`, error.stack);
            await this.alertService.sendAlert(
                'RISK ANALYSIS FAILED',
                `Error: ${error.message}`,
                'CRITICAL',
            );
        } finally {
            this.isRunning = false;
        }
    }

    /**
     * Check for player RTP (Return to Player) deviation
     * Players with unusually high RTP might be exploiting
     */
    async checkPlayerRTPDeviation(): Promise<void> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000);

        // Get players with significant betting activity
        const playerStats = await this.prisma.bet.groupBy({
            by: ['userId'],
            where: {
                placedAt: { gte: thirtyDaysAgo },
                status: { in: ['WON', 'LOST'] },
            },
            _sum: {
                stake: true,
                potentialWin: true,
            },
            _count: true,
            having: {
                stake: { _sum: { gt: 10000 } }, // Minimum 10K wagered
            },
        });

        for (const stat of playerStats) {
            if (stat._count < 50) continue; // Need minimum bets

            // Calculate RTP
            const wonBets = await this.prisma.bet.aggregate({
                where: {
                    userId: stat.userId,
                    placedAt: { gte: thirtyDaysAgo },
                    status: 'WON',
                },
                _sum: { potentialWin: true },
            });

            const totalStake = Number(stat._sum.stake || 0);
            const totalWon = Number(wonBets._sum.potentialWin || 0);

            if (totalStake > 0) {
                const rtp = totalWon / totalStake;

                // RTP > 110% is suspicious
                if (rtp > 1.1) {
                    await this.antiCheatService.flagForAudit(
                        stat.userId,
                        'HIGH_RTP_DEVIATION',
                        75,
                        { rtp, totalStake, totalWon, betCount: stat._count },
                    );

                    await this.alertService.sendAlert(
                        'HIGH RTP DETECTED',
                        `User ${stat.userId} has RTP ${(rtp * 100).toFixed(2)}% on ${stat._count} bets. Stake: ${totalStake}`,
                        'WARNING',
                    );
                }
            }
        }
    }

    /**
     * Check agent win rates for insider trading detection
     */
    async checkAgentWinRates(): Promise<void> {
        // Get all agents
        const agents = await this.prisma.user.findMany({
            where: {
                role: { in: ['AGENT', 'MASTER_AGENT', 'SUPER_AGENT'] },
                isLocked: false,
            },
            select: { id: true, username: true },
        });

        for (const agent of agents) {
            const isAbnormal = await this.antiCheatService.detectAbnormalWinRate(agent.id);

            if (isAbnormal) {
                // Auto-lock agent if win rate is suspicious
                const shouldLock = await this.antiCheatService.shouldAutoLock(agent.id);

                if (shouldLock) {
                    await this.lockService.lockUser(
                        agent.id,
                        'AUTO_LOCK: Abnormal win rate detected',
                        'SYSTEM',
                    );
                    this.logger.warn(`Auto-locked agent ${agent.username} due to abnormal win rate`);
                    await this.alertService.sendAlert(
                        'AGENT AUTO-LOCKED',
                        `Agent ${agent.username} (${agent.id}) locked due to abnormal win rate.`,
                        'CRITICAL',
                    );
                }
            }
        }
    }

    /**
     * Check for wallet balance mismatches
     * Compares calculated balance vs stored balance
     */
    async checkWalletMismatch(): Promise<void> {
        // Get wallets with significant activity
        const wallets = await this.prisma.wallet.findMany({
            where: {
                balance: { gt: 0 },
            },
            select: {
                id: true,
                userId: true,
                balance: true,
            },
            take: 100, // Batch processing
        });

        for (const wallet of wallets) {
            // Calculate expected balance from transactions
            const deposits = await this.prisma.payment.aggregate({
                where: {
                    userId: wallet.userId,
                    type: 'deposit',
                    status: 'approved',
                },
                _sum: { amount: true },
            });

            const withdrawals = await this.prisma.payment.aggregate({
                where: {
                    userId: wallet.userId,
                    type: 'withdraw',
                    status: 'approved',
                },
                _sum: { amount: true },
            });

            const betStakes = await this.prisma.bet.aggregate({
                where: { userId: wallet.userId },
                _sum: { stake: true },
            });

            const betWinnings = await this.prisma.bet.aggregate({
                where: {
                    userId: wallet.userId,
                    status: 'WON',
                },
                _sum: { potentialWin: true },
            });

            const expectedBalance =
                Number(deposits._sum.amount || 0) -
                Number(withdrawals._sum.amount || 0) -
                Number(betStakes._sum.stake || 0) +
                Number(betWinnings._sum.potentialWin || 0);

            const actualBalance = Number(wallet.balance);
            const difference = Math.abs(expectedBalance - actualBalance);

            // If difference > 1% and > 100, flag it
            if (difference > 100 && difference / actualBalance > 0.01) {
                await this.antiCheatService.flagForAudit(
                    wallet.userId,
                    'WALLET_MISMATCH',
                    80,
                    { expectedBalance, actualBalance, difference },
                );

                await this.alertService.sendAlert(
                    'WALLET MISMATCH',
                    `User ${wallet.userId} wallet mismatch. Exp: ${expectedBalance}, Act: ${actualBalance}, Diff: ${difference}`,
                    'CRITICAL',
                );

                // Auto-lock for significant mismatch
                if (difference > 1000) {
                    await this.lockService.lockUser(
                        wallet.userId,
                        'AUTO_LOCK: Significant wallet mismatch',
                        'SYSTEM',
                    );
                }
            }
        }
    }

    /**
     * Check for settlement mismatches
     * Verify bet settlements are correct
     */
    async checkSettlementMismatch(): Promise<void> {
        const oneHourAgo = new Date(Date.now() - 3600000);

        // Get recently settled bets
        const settledBets = await this.prisma.bet.findMany({
            where: {
                settledAt: { gte: oneHourAgo },
                status: { in: ['WON', 'LOST'] },
            },
            select: {
                id: true,
                userId: true,
                stake: true,
                odds: true,
                potentialWin: true,
                status: true,
            },
            take: 100,
        });

        for (const bet of settledBets) {
            // Verify potential win calculation
            const expectedPotentialWin = Number(bet.stake) * Number(bet.odds);
            const actualPotentialWin = Number(bet.potentialWin);

            if (Math.abs(expectedPotentialWin - actualPotentialWin) > 1) {
                await this.antiCheatService.flagForAudit(
                    bet.userId,
                    'SETTLEMENT_CALCULATION_MISMATCH',
                    90,
                    {
                        betId: bet.id,
                        expectedPotentialWin,
                        actualPotentialWin,
                        stake: bet.stake,
                        odds: bet.odds,
                    },
                );
                await this.alertService.sendAlert(
                    'SETTLEMENT MISMATCH',
                    `Bet ${bet.id} mismatch. Exp: ${expectedPotentialWin}, Act: ${actualPotentialWin}`,
                    'CRITICAL',
                );
            }
        }
    }

    /**
     * Check for suspicious betting patterns
     */
    async checkSuspiciousPatterns(): Promise<void> {
        const oneHourAgo = new Date(Date.now() - 3600000);

        // Find users with many bets in short time
        const highVolumeUsers = await this.prisma.bet.groupBy({
            by: ['userId'],
            where: {
                placedAt: { gte: oneHourAgo },
            },
            _count: true,
            having: {
                _all: { _count: { gt: 50 } }, // More than 50 bets in an hour
            },
        });

        for (const user of highVolumeUsers) {
            await this.antiCheatService.flagForAudit(
                user.userId,
                'HIGH_BETTING_VOLUME',
                55,
                { betCount: user._count, period: '1 hour' },
            );
        }
    }

    /**
     * Get risk summary for dashboard
     */
    async getRiskSummary(): Promise<{
        totalFlags: number;
        criticalFlags: number;
        lockedUsers: number;
        recentFlags: any[];
    }> {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 3600000);

        const [totalFlags, criticalFlags, lockedUsers, recentFlags] = await Promise.all([
            this.prisma.riskReport.count({
                where: { createdAt: { gte: twentyFourHoursAgo } },
            }),
            this.prisma.riskReport.count({
                where: {
                    createdAt: { gte: twentyFourHoursAgo },
                    score: { gte: 80 },
                },
            }),
            this.prisma.user.count({ where: { isLocked: true } }),
            this.prisma.riskReport.findMany({
                where: { createdAt: { gte: twentyFourHoursAgo } },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);

        return { totalFlags, criticalFlags, lockedUsers, recentFlags };
    }
}
