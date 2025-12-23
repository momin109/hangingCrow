import { Module } from '@nestjs/common';
import { RiskEngineService } from './risk-engine.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AntiCheatModule } from '../anti-cheat/anti-cheat.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [PrismaModule, AntiCheatModule, UserModule],
    providers: [RiskEngineService],
    exports: [RiskEngineService],
})
export class RiskEngineModule { }
