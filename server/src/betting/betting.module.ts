import { Module } from '@nestjs/common';
import { BettingController } from './betting.controller';
import { BettingService } from './betting.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CommissionModule } from '../commission/commission.module';

@Module({
    imports: [PrismaModule, CommissionModule],
    controllers: [BettingController],
    providers: [BettingService],
    exports: [BettingService],
})
export class BettingModule { }
