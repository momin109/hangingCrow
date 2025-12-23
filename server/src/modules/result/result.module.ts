import { Module } from '@nestjs/common';
import { ResultController } from 'src/modules/result/result.controller';
import { SettlementModule } from 'src/modules/settlement/settlement.module';
import { QueueModule } from 'src/modules/queue/queue.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [SettlementModule, QueueModule, PrismaModule],
    controllers: [ResultController],
})
export class ResultModule { }
