import { Module } from '@nestjs/common';
import { SettlementService } from 'src/modules/settlement/settlement.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [PrismaModule, BullModule.registerQueue({ name: 'settlement' })],
    providers: [SettlementService],
    exports: [SettlementService],
})
export class SettlementModule { }
