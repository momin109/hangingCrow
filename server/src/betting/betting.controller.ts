import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { BettingService } from './betting.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VpnGuard } from '../common/guards/vpn.guard';

@Controller('betting')
@UseGuards(JwtAuthGuard, VpnGuard)
export class BettingController {
    constructor(private bettingService: BettingService) { }

    @Post('place')
    placeBet(@Request() req, @Body() dto: PlaceBetDto) {
        return this.bettingService.placeBet({
            userId: req.user.id,
            marketId: dto.marketId,
            selectionId: dto.selectionId,
            odds: dto.odds,
            stake: dto.stake,
        });
    }
}
