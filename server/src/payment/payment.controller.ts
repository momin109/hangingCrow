import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('deposit')
    async deposit(@Request() req, @Body() body: { amount: number }) {
        return this.paymentService.deposit(req.user.id, body.amount);
    }

    @Post('withdraw')
    async withdraw(@Request() req, @Body() body: { amount: number }) {
        return this.paymentService.withdraw(req.user.id, body.amount);
    }

    @Get('balance')
    async getBalance(@Request() req) {
        return this.paymentService.getBalance(req.user.id);
    }
}
