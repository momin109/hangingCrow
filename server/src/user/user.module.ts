// import { Module } from '@nestjs/common';
// import { UserController } from 'src/user/user.controller';
// import { UserService } from 'src/user/user.service';
// import { HierarchyService } from 'src/user/hierarchy.service';
// import { PrismaModule } from 'src/prisma/prisma.module';

// @Module({
//     imports: [PrismaModule],
//     controllers: [UserController],
//     providers: [UserService, HierarchyService],
//     exports: [UserService, HierarchyService],
// })
// export class UserModule { }

import { Module } from "@nestjs/common";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.service";
import { HierarchyService } from "src/user/hierarchy.service";
import { LockService } from "src/user/lock.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, HierarchyService, LockService],
  exports: [UserService, HierarchyService, LockService],
})
export class UserModule {}
