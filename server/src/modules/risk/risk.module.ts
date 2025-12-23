import { Module } from '@nestjs/common';
import { RiskService } from 'src/modules/risk/risk.service';
import { RiskController } from 'src/modules/risk/risk.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [RiskController],
    providers: [RiskService],
    exports: [RiskService],
})
export class RiskModule { }
