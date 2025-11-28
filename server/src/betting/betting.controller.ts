import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { BettingService } from './betting.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('betting')
@UseGuards(JwtAuthGuard)
export class BettingController {
    constructor(private bettingService: BettingService) { }

    @Post('place')
    placeBet(@Request() req, @Body() dto: PlaceBetDto) {
        return this.bettingService.placeBet(req.user.id, req.user.tenantId, dto);
    }
}
