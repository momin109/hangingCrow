import { Module } from '@nestjs/common';
import { AntiCheatService } from 'src/anti-cheat/anti-cheat.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AntiCheatService],
    exports: [AntiCheatService],
})
export class AntiCheatModule { }
