import { Body, Controller, Post, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Post('deposit')
    initiateDeposit(@Body() body: { userId: string; amount: number; provider: string }) {
        return this.paymentService.initiateDeposit(body.userId, body.amount, body.provider);
    }

    @Post('webhook/:provider')
    handleWebhook(@Param('provider') provider: string, @Body() body: any) {
        return this.paymentService.handleWebhook(provider, body);
    }
}
