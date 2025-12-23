import { Injectable, Logger, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommissionService } from 'src/commission/commission.service';
import { AntiCheatService } from 'src/anti-cheat/anti-cheat.service';
import { LockService } from 'src/user/lock.service';
import { AuditService } from 'src/common/audit.service';
import { AlertService } from 'src/common/alert.service';
import { CommissionType } from '@prisma/client';
import * as crypto from 'crypto';

/**
 * Enhanced Betting Service with production-ready settlement logic
 * Includes anti-cheat, lock checking, and odds freeze protection
 */
@Injectable()
export class BettingService {
    private readonly logger = new Logger(BettingService.name);
    private readonly ODDS_FREEZE_SECONDS = parseInt(process.env.ODDS_FREEZE_SECONDS || '5');
    private readonly MAX_AGENT_EXPOSURE = 1000000; // 10 Lakhs default cap

    constructor(
        private prisma: PrismaService,
        private commissionService: CommissionService,
        private antiCheatService: AntiCheatService,
        private lockService: LockService,
        private auditService: AuditService,
        private configService: ConfigService,
        private alertService: AlertService,
    ) { }

    /**
     * Check if global kill-switch is active
     */
    private isKillSwitchActive(): boolean {
        return this.configService.get<string>('BETTING_KILL_SWITCH') === 'true';
    }

    /**
     * Create odds snapshot for bet validation
     */
    private async createOddsSnapshot(marketId: string, odds: number, fancyId?: number): Promise<{ id: string; hash: string }> {
        const oddsData = { marketId, odds, fancyId, timestamp: Date.now() };
        const hash = crypto.createHash('sha256').update(JSON.stringify(oddsData)).digest('hex');

        const snapshot = await this.prisma.oddsSnapshot.create({
            data: {
                marketId,
                fancyId,
                odds: oddsData,
                hash,
                expiresAt: new Date(Date.now() + this.ODDS_FREEZE_SECONDS * 1000),
            },
        });

        return { id: snapshot.id, hash: snapshot.hash };
    }

    /**
     * Place a bet with atomic wallet deduction
     */
    async placeBet(betData: {
        userId: string;
        marketId: string;
        selectionId: string;
        odds: number;
        stake: number;
        ipAddress?: string;
    }) {
        // 0. Kill-Switch Check
        if (this.isKillSwitchActive()) {
            throw new ForbiddenException('Betting is currently suspended.');
        }

        this.logger.log(`Placing bet for user ${betData.userId}, stake: ${betData.stake}`);

        // 1. Check permissions and locks
        const isLocked = await this.lockService.isUserOrAncestorLocked(betData.userId);
        if (isLocked) {
            throw new ForbiddenException('Account is locked.');
        }

        // 2. Anti-cheat validation
        await this.antiCheatService.validateBetPlacement(
            betData.userId,
            betData.marketId,
            betData.odds,
            betData.ipAddress,
        );

        // 3. Validate bet constraints
        if (betData.stake < 10) throw new BadRequestException('Minimum stake is ₹10');
        if (betData.stake > 100000) throw new BadRequestException('Maximum stake is ₹100,000');
        if (betData.odds < 1.01 || betData.odds > 1000) throw new BadRequestException('Invalid odds');

        // 4. Check Agent Exposure Cap
        const user = await this.prisma.user.findUnique({ where: { id: betData.userId }, include: { parent: true } });
        if (user?.parent) {
            const potentialWin = betData.stake * betData.odds;
            const agentExposure = await this.getUserExposure(user.parentId);

            if (agentExposure.totalExposure + potentialWin > this.MAX_AGENT_EXPOSURE) {
                await this.alertService.sendAlert(
                    'AGENT EXPOSURE CAP HIT',
                    `Agent ${user.parent.username} hit exposure cap. Bet rejected.`,
                    'WARNING'
                );
                throw new ForbiddenException('Bet rejected: Agent exposure limit reached.');
            }
        }

        // 5. Create odds snapshot
        const oddsSnapshot = await this.createOddsSnapshot(betData.marketId, betData.odds);
        const potentialWin = betData.stake * betData.odds;

        // 6. Execute Transaction
        const result = await this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { userId: betData.userId } });

            if (!wallet || Number(wallet.balance) < betData.stake) {
                throw new BadRequestException('Insufficient balance');
            }

            const walletUpdate = await tx.wallet.updateMany({
                where: { userId: betData.userId, version: wallet.version },
                data: {
                    balance: { decrement: betData.stake },
                    version: { increment: 1 },
                },
            });

            if (walletUpdate.count === 0) {
                throw new BadRequestException('Transaction conflict. Please try again.');
            }

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
                    meta: {
                        snapshotId: oddsSnapshot.id,
                        snapshotHash: oddsSnapshot.hash,
                        ipAddress: betData.ipAddress,
                    },
                },
            });

            return bet;
        });

        // 7. Audit Log
        this.auditService.logBetPlace(
            betData.userId,
            result.id,
            betData.stake,
            betData.odds,
            betData.ipAddress,
        ).catch(err => this.logger.error(err));

        return result;
    }

    /**
     * Settle a bet as WON/LOST/VOID
     */
    async settleBet(betId: string, result: 'WON' | 'LOST' | 'VOID' | 'HALF_WON' | 'HALF_LOST') {
        return await this.prisma.$transaction(async (tx) => {
            const bet = await tx.bet.findUnique({ where: { id: betId } });
            if (!bet) throw new NotFoundException('Bet not found');
            if (bet.status !== 'PENDING') throw new BadRequestException('Bet already settled');

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
                    payoutAmount = Number(bet.stake);
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

            await tx.bet.update({
                where: { id: betId },
                data: { status: result, settledAt: new Date() },
            });

            if (payoutAmount > 0) {
                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: { balance: { increment: payoutAmount } },
                });
            }

            await tx.betSettle.create({
                data: {
                    betId: betId,
                    amount: profitLoss,
                    type: result === 'VOID' ? 'VOID' : result === 'WON' || result === 'HALF_WON' ? 'WIN' : 'LOSS',
                },
            });

            // Commission (fire and forget handled safely)
            if (result === 'LOST' || result === 'HALF_LOST') {
                const houseProfit = Math.abs(profitLoss);
                this.commissionService.distributeCommission(bet.userId, houseProfit, CommissionType.TURNOVER).catch(err => { });
            }

            return { bet, payout: payoutAmount, profitLoss };
        });
    }

    /**
     * Rollback a settled bet (Emergency Action)
     */
    async rollbackSettlement(betId: string) {
        this.logger.warn(`Initiating rollback for bet ${betId}`);

        return await this.prisma.$transaction(async (tx) => {
            const bet = await tx.bet.findUnique({ where: { id: betId } });
            if (!bet) throw new NotFoundException('Bet not found');
            if (bet.status === 'PENDING') throw new BadRequestException('Bet is not settled');

            // Revert Payout from Wallet
            let payoutToRevert = 0;
            if (bet.status === 'WON') payoutToRevert = Number(bet.potentialWin);
            else if (bet.status === 'VOID') payoutToRevert = Number(bet.stake);
            else if (bet.status === 'HALF_WON') payoutToRevert = Number(bet.stake) + (Number(bet.potentialWin) - Number(bet.stake)) / 2;
            else if (bet.status === 'HALF_LOST') payoutToRevert = Number(bet.stake) / 2;

            if (payoutToRevert > 0) {
                const wallet = await tx.wallet.findUnique({ where: { userId: bet.userId } });
                if (Number(wallet.balance) < payoutToRevert) {
                    throw new BadRequestException('User has insufficient balance for rollback');
                }

                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: { balance: { decrement: payoutToRevert } }
                });
            }

            // Restore Bet Status
            await tx.bet.update({
                where: { id: betId },
                data: { status: 'PENDING', settledAt: null }
            });

            // Remove settlement record
            await tx.betSettle.deleteMany({ where: { betId } });

            await this.auditService.logAction(bet.userId, 'BET_ROLLBACK', 'BET', bet.id, { reason: 'Admin Rollback' });

            return { success: true };
        });
    }

    async getBetHistory(userId: string, filters?: { status?: string; limit?: number; offset?: number }) {
        const where: any = { userId };
        if (filters?.status) where.status = filters.status;
        const limit = filters?.limit || 50;
        const offset = filters?.offset || 0;
        const [bets, total] = await Promise.all([
            this.prisma.bet.findMany({ where, orderBy: { placedAt: 'desc' }, take: limit, skip: offset }),
            this.prisma.bet.count({ where }),
        ]);
        return { data: bets, total, page: Math.floor(offset / limit) + 1, totalPages: Math.ceil(total / limit) };
    }

    async getLiveBets(tenantId?: string) {
        const where: any = { status: 'PENDING' };
        if (tenantId) where.tenantId = tenantId;
        return await this.prisma.bet.findMany({
            where,
            include: { user: { select: { username: true, role: true } } },
            orderBy: { placedAt: 'desc' },
            take: 100,
        });
    }

    async getTopPlayers(limit: number = 10) {
        const result = await this.prisma.bet.groupBy({
            by: ['userId'],
            where: { status: 'PENDING' },
            _sum: { stake: true, potentialWin: true },
            _count: true,
            having: { _sum: { potentialWin: { not: null } } },
            orderBy: { _sum: { potentialWin: 'desc' } },
            take: limit,
        });
        const enriched = await Promise.all(result.map(async (item) => {
            const user = await this.prisma.user.findUnique({ where: { id: item.userId }, select: { username: true, role: true } });
            return { ...user, userId: item.userId, totalStake: Number(item._sum.stake || 0), totalExposure: Number(item._sum.potentialWin || 0) };
        }));
        return enriched;
    }

    async getUserExposure(userId: string) {
        const result = await this.prisma.bet.aggregate({
            where: { userId, status: 'PENDING' },
            _sum: { stake: true, potentialWin: true },
            _count: true,
        });
        return {
            pendingBets: result._count,
            totalStake: Number(result._sum.stake || 0),
            totalExposure: Number(result._sum.potentialWin || 0),
        };
    }
}
