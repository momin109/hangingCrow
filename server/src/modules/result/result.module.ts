import { Module } from '@nestjs/common';
import { ResultController } from './result.controller';
import { SettlementModule } from '../settlement/settlement.module';
import { QueueModule } from '../queue/queue.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [SettlementModule, QueueModule, PrismaModule],
    controllers: [ResultController],
})
export class ResultModule { }
