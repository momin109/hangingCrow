import { Module } from '@nestjs/common';
import { BettingController } from 'src/betting/betting.controller';
import { BettingService } from 'src/betting/betting.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommissionModule } from 'src/commission/commission.module';

@Module({
    imports: [PrismaModule, CommissionModule],
    controllers: [BettingController],
    providers: [BettingService],
    exports: [BettingService],
})
export class BettingModule { }
