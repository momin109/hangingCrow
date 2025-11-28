import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BettingModule } from './betting/betting.module';
import { CommissionModule } from './commission/commission.module';
import { PaymentModule } from './payment/payment.module';
import { KycModule } from './kyc/kyc.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        BettingModule,
        CommissionModule,
        PaymentModule,
        KycModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
