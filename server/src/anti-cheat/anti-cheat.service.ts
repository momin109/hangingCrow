import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Anti-Cheat Service
 * Detects and prevents betting manipulation, insider trading, and suspicious patterns
 */
@Injectable()
export class AntiCheatService {
    private readonly logger = new Logger(AntiCheatService.name);

    // Configuration (can be moved to env)
    private readonly MAX_BETS_PER_WINDOW = parseInt(process.env.MAX_BETS_PER_3_SECONDS || '3');
    private readonly BET_WINDOW_MS = 3000; // 3 seconds
    private readonly WIN_RATE_THRESHOLD = parseFloat(process.env.RISK_THRESHOLD_WIN_RATE || '0.7');
    private readonly ODDS_FREEZE_SECONDS = parseInt(process.env.ODDS_FREEZE_SECONDS || '5');

    constructor(private prisma: PrismaService) { }

    /**
     * Validate bet placement for suspicious activity
     * Called before every bet is placed
     */
    async validateBetPlacement(
        userId: string,
        marketId: string,
        odds: number,
        ipAddress?: string,
    ): Promise<void> {
        // 1. Check if user is locked
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isLocked: true, role: true },
        });

        if (user?.isLocked) {
            throw new ForbiddenException('Account is locked. Contact support.');
        }

        // 2. Check rapid betting (anti-cheat)
        await this.checkRapidBetting(userId, marketId);

        // 3. Check if odds are within valid range
        if (odds < 1.01 || odds > 1000) {
            await this.flagForAudit(userId, 'INVALID_ODDS_SUBMITTED', 50, { odds, marketId });
            throw new ForbiddenException('Invalid odds submitted');
        }

        // 4. Check multiple users from same IP (optional)
        if (ipAddress) {
            await this.checkMultipleUsersFromIP(userId, ipAddress);
        }

        this.logger.debug(`Bet validation passed for user ${userId}`);
    }

    /**
     * Detect rapid betting pattern (>N bets in M seconds)
     */
    async checkRapidBetting(userId: string, marketId: string): Promise<void> {
        const windowStart = new Date(Date.now() - this.BET_WINDOW_MS);

        const recentBetCount = await this.prisma.bet.count({
            where: {
                userId,
                marketId,
                placedAt: { gte: windowStart },
            },
        });

        if (recentBetCount >= this.MAX_BETS_PER_WINDOW) {
            await this.flagForAudit(userId, 'RAPID_BETTING_DETECTED', 70, {
                betCount: recentBetCount,
                windowMs: this.BET_WINDOW_MS,
                marketId,
            });
            throw new ForbiddenException('Too many bets in short time. Please slow down.');
        }
    }

    /**
     * Detect multiple users betting from same IP
     */
    async checkMultipleUsersFromIP(userId: string, ipAddress: string): Promise<string[]> {
        const windowStart = new Date(Date.now() - 3600000); // Last hour

        const recentBetsFromIP = await this.prisma.auditLog.findMany({
            where: {
                action: 'BET_PLACE',
                ipAddress,
                createdAt: { gte: windowStart },
            },
            select: { userId: true },
            distinct: ['userId'],
        });

        const uniqueUsers = [...new Set(recentBetsFromIP.map((b) => b.userId))];

        if (uniqueUsers.length > 3 && uniqueUsers.includes(userId)) {
            await this.flagForAudit(userId, 'MULTIPLE_USERS_SAME_IP', 60, {
                ipAddress,
                userCount: uniqueUsers.length,
            });
            this.logger.warn(`Multiple users (${uniqueUsers.length}) detected from IP ${ipAddress}`);
        }

        return uniqueUsers;
    }

    /**
     * Detect abnormal win rate for agents (insider trading detection)
     * Returns true if suspicious
     */
    async detectAbnormalWinRate(agentId: string): Promise<boolean> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000);

        // Get all users under this agent
        const usersUnderAgent = await this.prisma.user.findMany({
            where: { parentId: agentId },
            select: { id: true },
        });

        if (usersUnderAgent.length === 0) return false;

        const userIds = usersUnderAgent.map((u) => u.id);

        // Calculate win rate
        const [totalBets, wonBets] = await Promise.all([
            this.prisma.bet.count({
                where: {
                    userId: { in: userIds },
                    placedAt: { gte: thirtyDaysAgo },
                    status: { in: ['WON', 'LOST'] },
                },
            }),
            this.prisma.bet.count({
                where: {
                    userId: { in: userIds },
                    placedAt: { gte: thirtyDaysAgo },
                    status: 'WON',
                },
            }),
        ]);

        if (totalBets < 50) return false; // Not enough data

        const winRate = wonBets / totalBets;

        if (winRate > this.WIN_RATE_THRESHOLD) {
            await this.flagForAudit(agentId, 'ABNORMAL_WIN_RATE', 85, {
                winRate,
                totalBets,
                wonBets,
                threshold: this.WIN_RATE_THRESHOLD,
            });
            this.logger.warn(`Agent ${agentId} has abnormal win rate: ${(winRate * 100).toFixed(1)}%`);
            return true;
        }

        return false;
    }

    /**
     * Detect fast bet + cancel pattern
     */
    async detectBetCancelPattern(userId: string): Promise<boolean> {
        const windowStart = new Date(Date.now() - 3600000); // Last hour

        const voidedBets = await this.prisma.bet.count({
            where: {
                userId,
                status: 'VOID',
                settledAt: { gte: windowStart },
            },
        });

        const totalBets = await this.prisma.bet.count({
            where: {
                userId,
                placedAt: { gte: windowStart },
            },
        });

        if (totalBets > 10 && voidedBets / totalBets > 0.5) {
            await this.flagForAudit(userId, 'BET_CANCEL_PATTERN', 65, {
                voidedBets,
                totalBets,
                voidRate: voidedBets / totalBets,
            });
            return true;
        }

        return false;
    }

    /**
     * Flag user for audit review
     */
    async flagForAudit(
        userId: string,
        reason: string,
        riskScore: number,
        meta?: Record<string, any>,
    ): Promise<void> {
        try {
            await this.prisma.riskReport.create({
                data: {
                    userId,
                    reason,
                    score: riskScore,
                    meta: meta || {},
                },
            });

            this.logger.warn(`Risk flag created: ${reason} for user ${userId} (score: ${riskScore})`);
        } catch (error) {
            this.logger.error(`Failed to create risk flag: ${error.message}`);
        }
    }

    /**
     * Get user's risk score (aggregate of recent flags)
     */
    async getUserRiskScore(userId: string): Promise<number> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000);

        const result = await this.prisma.riskReport.aggregate({
            where: {
                userId,
                createdAt: { gte: thirtyDaysAgo },
            },
            _max: { score: true },
            _avg: { score: true },
        });

        // Return max of (average, highest) for conservative risk assessment
        return Math.max(result._avg.score || 0, result._max.score || 0);
    }

    /**
     * Check if user should be auto-locked based on risk
     */
    async shouldAutoLock(userId: string): Promise<boolean> {
        const riskScore = await this.getUserRiskScore(userId);
        return riskScore >= 80;
    }
}
