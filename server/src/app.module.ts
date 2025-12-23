import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BettingModule } from './betting/betting.module';
import { PaymentModule } from './payment/payment.module';
import { CommissionModule } from './commission/commission.module';
import { KycModule } from './kyc/kyc.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { QueueModule } from './modules/queue/queue.module';
import { RiskModule } from './modules/risk/risk.module';
import { ResultModule } from './modules/result/result.module';
import { SettlementModule } from './modules/settlement/settlement.module';
import { RiskEngineModule } from './risk/risk-engine.module';
import { AntiCheatModule } from './anti-cheat/anti-cheat.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests
            },
        ]),
        ScheduleModule.forRoot(),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
            },
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        BettingModule,
        PaymentModule,
        CommissionModule,
        KycModule,
        CommonModule,
        QueueModule,
        RiskModule,
        ResultModule,
        SettlementModule,
        RiskEngineModule,
        AntiCheatModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
