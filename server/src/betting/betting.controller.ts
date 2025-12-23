import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { BettingService } from 'src/betting/betting.service';
import { PlaceBetDto } from 'src/betting/dto/place-bet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('betting')
@UseGuards(JwtAuthGuard)
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
