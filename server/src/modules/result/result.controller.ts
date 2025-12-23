import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettlementService } from '../settlement/settlement.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Result Declaration')
@ApiBearerAuth()
@Controller('result')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResultController {
    constructor(
        private settlementService: SettlementService,
        private prisma: PrismaService,
    ) { }

    @Post('declare')
    @ApiOperation({ summary: 'Declare match/market result and queue settlement' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async declareResult(
        @Body()
        body: {
            matchId: number;
            marketId?: number;
            resultData: any;
            declaredBy?: string;
        },
    ) {
        // Create result record
        const result = await this.prisma.result.create({
            data: {
                matchId: body.matchId,
                marketId: body.marketId,
                resultData: body.resultData,
                declaredBy: body.declaredBy,
                declaredAt: new Date(),
            },
        });

        // Queue settlement processing
        const job = await this.settlementService.queueSettlement({
            matchId: body.matchId,
            marketId: body.marketId,
            resultData: body.resultData,
        });

        return {
            success: true,
            resultId: result.id,
            settlementJob: job,
            message: 'Result declared and settlement queued successfully',
        };
    }

    @Post('queue-stats')
    @ApiOperation({ summary: 'Get settlement queue statistics' })
    @Roles(Role.ADMIN, Role.SUPERADMIN, Role.OWNER)
    async getQueueStats() {
        return this.settlementService.getQueueStats();
    }
}
