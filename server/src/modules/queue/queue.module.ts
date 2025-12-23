import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettlementProcessor } from './settlement.processor';
import { SettlementService } from '../settlement/settlement.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommissionModule } from '../../commission/commission.module';

@Module({
    imports: [
        BullModule.registerQueueAsync({
            name: 'settlement',
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST', 'localhost'),
                    port: configService.get('REDIS_PORT', 6379),
                },
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }),
            inject: [ConfigService],
        }),
        PrismaModule,
        CommissionModule,
    ],
    providers: [SettlementService, SettlementProcessor],
    exports: [SettlementService],
})
export class QueueModule { }
