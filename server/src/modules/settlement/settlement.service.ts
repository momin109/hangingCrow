import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Settlement Service - Handles queuing and processing bet settlements
 */
@Injectable()
export class SettlementService {
    private readonly logger = new Logger(SettlementService.name);

    constructor(
        private prisma: PrismaService,
        @InjectQueue('settlement') private settlementQueue: Queue,
    ) { }

    /**
     * Queue a settlement job for processing
     */
    async queueSettlement(data: {
        matchId: number;
        marketId?: number;
        resultData: any;
    }) {
        this.logger.log(`Queuing settlement for match ${data.matchId}`);

        // Add job to Bull queue
        const job = await this.settlementQueue.add('process-settlement', data, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });

        this.logger.log(`Settlement job queued: ${job.id}`);
        return { jobId: job.id, status: 'queued' };
    }

    /**
     * Process settlement (called by queue processor)
     */
    async processSettlement(data: {
        matchId: number;
        marketId?: number;
        resultData: any;
    }) {
        this.logger.log(
            `Processing settlement for match ${data.matchId}, market ${data.marketId}`,
        );

        try {
            // Find all open bets for this market
            const bets = await this.prisma.bet.findMany({
                where: {
                    newMarketId: data.marketId,
                    status: 'PENDING',
                },
                include: {
                    user: true,
                },
            });

            this.logger.log(`Found ${bets.length} bets to settle`);

            // Settle each bet
            for (const bet of bets) {
                await this.settleBet(bet.id, data.resultData);
            }

            this.logger.log(`Settlement completed for ${bets.length} bets`);

            return {
                success: true,
                betsProcessed: bets.length,
            };
        } catch (error) {
            this.logger.error(`Settlement processing failed:`, error);
            throw error;
        }
    }

    /**
     * Settle individual bet based on result
     */
    async settleBet(betId: string, resultData: any) {
        return await this.prisma.$transaction(async (tx) => {
            const bet = await tx.bet.findUnique({
                where: { id: betId },
            });

            if (!bet || bet.status !== 'PENDING') {
                return null;
            }

            // Determine result (simplified logic - customize based on your result format)
            const result = this.determineResult(bet, resultData);
            let payoutAmount = 0;
            let profitLoss = 0;

            switch (result) {
                case 'WON':
                    payoutAmount = Number(bet.potentialWin);
                    profitLoss = Number(bet.potentialWin) - Number(bet.stake);
                    break;
                case 'HALF_WON':
                    payoutAmount =
                        Number(bet.stake) +
                        (Number(bet.potentialWin) - Number(bet.stake)) / 2;
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

            // Update bet status
            await tx.bet.update({
                where: { id: betId },
                data: {
                    status: result,
                    settledAt: new Date(),
                },
            });

            // Update wallet if payout exists
            if (payoutAmount > 0) {
                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: {
                        balance: { increment: payoutAmount },
                    },
                });
            }

            // Create settlement record
            await tx.betSettle.create({
                data: {
                    betId: betId,
                    amount: profitLoss,
                    type:
                        result === 'VOID'
                            ? 'VOID'
                            : result === 'WON' || result === 'HALF_WON'
                                ? 'WIN'
                                : 'LOSS',
                },
            });

            this.logger.log(
                `Bet ${betId} settled as ${result}, payout: ${payoutAmount}`,
            );

            return {
                betId,
                result,
                payoutAmount,
                profitLoss,
            };
        });
    }

    /**
     * Determine bet result based on result data
     * Customize this logic based on your betting rules
     */
    private determineResult(bet: any, resultData: any): string {
        // Example logic - customize based on your needs
        if (resultData.void) {
            return 'VOID';
        }

        // Check if selection matches winner
        if (resultData.winner === bet.selectionId) {
            return 'WON';
        }

        return 'LOST';
    }

    /**
     * Get settlement queue statistics
     */
    async getQueueStats() {
        const waiting = await this.settlementQueue.getWaiting();
        const active = await this.settlementQueue.getActive();
        const completed = await this.settlementQueue.getCompleted();
        const failed = await this.settlementQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }
}
