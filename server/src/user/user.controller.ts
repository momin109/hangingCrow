import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @Roles('OWNER', 'MOTHER', 'WHITELABEL', 'SUPERADMIN', 'ADMIN', 'B2C_SUBADMIN', 'B2B_SUBADMIN')
    async findAll(
        @CurrentUser() user: any,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.userService.findAll(user.role, user.tenantId, Number(page || 1), Number(limit || 10));
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.userService.findOne(id, user.id, user.role);
    }

    @Get(':id/downline')
    async getDownline(@Param('id') id: string, @CurrentUser() user: any) {
        return this.userService.getDownlineTree(id, user.id, user.role);
    }

    @Post()
    @Roles('OWNER', 'MOTHER', 'WHITELABEL', 'SUPERADMIN', 'ADMIN', 'AGENT', 'MASTER_AGENT', 'SUPER_AGENT')
    async createUser(
        @Body() createUserDto: {
            username: string;
            password: string;
            role: Role;
            parentId?: string;
        },
        @CurrentUser() user: any,
    ) {
        return this.userService.createUser(
            createUserDto.username,
            createUserDto.password,
            createUserDto.role,
            createUserDto.parentId || user.id,
            user.role,
            user.tenantId,
        );
    }

    @Put(':id/balance')
    @Roles('OWNER', 'MOTHER', 'WHITELABEL', 'SUPERADMIN', 'ADMIN', 'AGENT', 'MASTER_AGENT', 'SUPER_AGENT')
    async updateBalance(
        @Param('id') id: string,
        @Body() updateBalanceDto: { amount: number },
        @CurrentUser() user: any,
    ) {
        return this.userService.updateBalance(
            id,
            updateBalanceDto.amount,
            user.id,
            user.role,
        );
    }
}
