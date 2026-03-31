// import { Module } from '@nestjs/common';
// import { BettingController } from 'src/betting/betting.controller';
// import { BettingService } from 'src/betting/betting.service';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { CommissionModule } from 'src/commission/commission.module';

// @Module({
//     imports: [PrismaModule, CommissionModule],
//     controllers: [BettingController],
//     providers: [BettingService],
//     exports: [BettingService],
// })
// export class BettingModule { }
//======================================

import { Module } from "@nestjs/common";
import { BettingService } from "./betting.service";
import { BettingController } from "./betting.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { CommissionModule } from "src/commission/commission.module";
import { AntiCheatModule } from "src/anti-cheat/anti-cheat.module";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [PrismaModule, CommissionModule, AntiCheatModule, UserModule],
  controllers: [BettingController],
  providers: [BettingService],
  exports: [BettingService],
})
export class BettingModule {}
