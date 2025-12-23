import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Risk Management Service
 * Handles exposure calculation, top players tracking, and suspicious activity detection
 */
@Injectable()
export class RiskService {
    private readonly logger = new Logger(RiskService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Compute total exposure (potential liability) for a market
     */
    async computeExposureForMarket(marketId: number) {
        this.logger.log(`Computing exposure for market ${marketId}`);

        // Find all open bets for this market
        const bets = await this.prisma.bet.findMany({
            where: { newMarketId: marketId, status: 'PENDING' },
        });

        let totalExposure = 0;

        for (const bet of bets) {
            // Potential liability = stake * (odds - 1)
            const liability = Number(bet.stake) * (Number(bet.odds) - 1);
            totalExposure += liability;
        }

        this.logger.log(`Market ${marketId} exposure: ${totalExposure}`);

        return {
            marketId,
            totalExposure,
            betCount: bets.length,
            timestamp: new Date(),
        };
    }

    /**
     * Get top players by current exposure
     */
    async topPlayers(limit = 10) {
        this.logger.log(`Fetching top ${limit} players by exposure`);

        // Use raw query for better performance
        const raw: any = await this.prisma.$queryRawUnsafe(`
      SELECT "user_id" as "userId", 
             SUM(CAST(stake AS numeric)) as total_stake,
             SUM(CAST(potential_win AS numeric)) as total_exposure,
             COUNT(*) as bet_count
      FROM "Bet"
      WHERE status = 'PENDING'
      GROUP BY "user_id"
      ORDER BY total_exposure DESC
      LIMIT ${limit};
    `);

        // Enrich with user data
        const enriched = await Promise.all(
            raw.map(async (item: any) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: item.userId },
                    select: { username: true, role: true },
                });
                return {
                    userId: item.userId,
                    username: user?.username,
                    role: user?.role,
                    totalStake: parseFloat(item.total_stake || 0),
                    totalExposure: parseFloat(item.total_exposure || 0),
                    betCount: parseInt(item.bet_count || 0),
                };
            }),
        );

        return enriched;
    }

    /**
     * Detect suspicious betting patterns
     */
    async detectSuspicious(betId: string) {
        this.logger.log(`Analyzing bet ${betId} for suspicious activity`);

        const bet = await this.prisma.bet.findUnique({
            where: { id: betId },
        });

        if (!bet) {
            return null;
        }

        // Get user's recent betting history
        const userBets = await this.prisma.bet.findMany({
            where: { userId: bet.userId },
            orderBy: { placedAt: 'desc' },
            take: 10,
        });

        const avgStake =
            userBets.reduce((sum, b) => sum + Number(b.stake), 0) /
            (userBets.length || 1);

        let score = 0;
        const reasons: string[] = [];

        // Rule 1: Large stake compared to average
        if (Number(bet.stake) > avgStake * 5) {
            score += 50;
            reasons.push('Large stake compared to historical average');
        }

        // Rule 2: Very large absolute stake
        if (Number(bet.stake) > 10000) {
            score += 20;
            reasons.push('Unusually high stake amount');
        }

        // Rule 3: Rapid multiple bets (5+ bets in last minute)
        const recentBets = userBets.filter(
            (b) => new Date().getTime() - new Date(b.placedAt).getTime() < 60000,
        );

        if (recentBets.length >= 5) {
            score += 30;
            reasons.push('Rapid multiple bets within short timeframe');
        }

        // Rule 4: High odds on large stake
        if (Number(bet.odds) > 50 && Number(bet.stake) > 1000) {
            score += 25;
            reasons.push('High odds with significant stake');
        }

        // Create risk report if score is significant
        if (score > 0) {
            await this.prisma.riskReport.create({
                data: {
                    userId: bet.userId,
                    betId: bet.id,
                    reason: reasons.join('; '),
                    score,
                    meta: {
                        avgStake,
                        currentStake: Number(bet.stake),
                        recentBetCount: recentBets.length,
                        odds: Number(bet.odds),
                    },
                },
            });

            this.logger.warn(
                `Risk report created for bet ${betId} - Score: ${score}`,
            );
        }

        return {
            betId,
            score,
            reasons,
            flagged: score >= 50, // Flag if score is 50 or higher
        };
    }

    /**
     * Get high-risk users
     */
    async getHighRiskUsers(minScore: number = 50, limit: number = 20) {
        const reports = await this.prisma.riskReport.findMany({
            where: {
                score: {
                    gte: minScore,
                },
            },
            orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
            take: limit,
        });

        // Group by user and aggregate
        const userRiskMap = new Map<
            string,
            { userId: string; totalScore: number; reportCount: number }
        >();

        for (const report of reports) {
            if (!userRiskMap.has(report.userId)) {
                userRiskMap.set(report.userId, {
                    userId: report.userId,
                    totalScore: 0,
                    reportCount: 0,
                });
            }
            const userData = userRiskMap.get(report.userId)!;
            userData.totalScore += report.score;
            userData.reportCount++;
        }

        // Convert to array and enrich with user data
        const enriched = await Promise.all(
            Array.from(userRiskMap.values()).map(async (item) => {
                const user = await this.prisma.user.findUnique({
                    where: { id: item.userId },
                    select: { username: true, role: true },
                });
                return {
                    ...item,
                    username: user?.username,
                    role: user?.role,
                    avgScore: Math.round(item.totalScore / item.reportCount),
                };
            }),
        );

        return enriched.sort((a, b) => b.totalScore - a.totalScore);
    }

    /**
     * Get market exposure summary for all active markets
     */
    async getAllMarketsExposure() {
        const markets = await this.prisma.market.findMany({
            where: {
                status: 'open',
            },
            select: {
                id: true,
                name: true,
                matchId: true,
            },
        });

        const exposures = await Promise.all(
            markets.map((market) => this.computeExposureForMarket(market.id)),
        );

        return exposures.sort((a, b) => b.totalExposure - a.totalExposure);
    }
}
