import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HierarchyService } from './hierarchy.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, HierarchyService],
    exports: [UserService, HierarchyService],
})
export class UserModule { }
