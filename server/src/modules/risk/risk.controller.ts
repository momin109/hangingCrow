import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RiskService } from 'src/modules/risk/risk.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Risk Management')
@ApiBearerAuth()
@Controller('risk')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RiskController {
    constructor(private riskService: RiskService) { }

    @Get('exposure/:marketId')
    @ApiOperation({ summary: 'Get market exposure' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async getMarketExposure(@Param('marketId') marketId: string) {
        return this.riskService.computeExposureForMarket(parseInt(marketId));
    }

    @Get('exposure/all')
    @ApiOperation({ summary: 'Get all markets exposure' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async getAllMarketsExposure() {
        return this.riskService.getAllMarketsExposure();
    }

    @Get('top-players')
    @ApiOperation({ summary: 'Get top players by exposure' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async getTopPlayers(@Query('limit') limit?: string) {
        return this.riskService.topPlayers(limit ? parseInt(limit) : 10);
    }

    @Get('high-risk-users')
    @ApiOperation({ summary: 'Get high-risk users' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async getHighRiskUsers(
        @Query('minScore') minScore?: string,
        @Query('limit') limit?: string,
    ) {
        return this.riskService.getHighRiskUsers(
            minScore ? parseInt(minScore) : 50,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get('analyze/:betId')
    @ApiOperation({ summary: 'Analyze bet for suspicious activity' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async analyzeBet(@Param('betId') betId: string) {
        return this.riskService.detectSuspicious(betId);
    }
}
