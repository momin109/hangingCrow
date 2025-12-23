import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SettlementService } from 'src/modules/settlement/settlement.service';

/**
 * Settlement Queue Processor
 * Processes settlement jobs from the Bull queue
 */
@Processor('settlement')
export class SettlementProcessor {
    private readonly logger = new Logger(SettlementProcessor.name);

    constructor(private settlementService: SettlementService) { }

    @Process('process-settlement')
    async handleSettlement(job: Job) {
        this.logger.log(`Processing settlement job ${job.id}`);

        try {
            const { matchId, marketId, resultData } = job.data;

            // Process the settlement
            const result = await this.settlementService.processSettlement({
                matchId,
                marketId,
                resultData,
            });

            this.logger.log(
                `Settlement job ${job.id} completed. Processed ${result.betsProcessed} bets`,
            );

            return result;
        } catch (error) {
            this.logger.error(`Settlement job ${job.id} failed:`, error);
            throw error; // This will trigger retry based on job options
        }
    }
}
