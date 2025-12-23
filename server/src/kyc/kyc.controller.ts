import { Body, Controller, Post } from '@nestjs/common';
import { KycService } from 'src/kyc/kyc.service';

@Controller('kyc')
export class KycController {
    constructor(private kycService: KycService) { }

    @Post('initiate')
    initiateCheck(@Body() body: { userId: string }) {
        return this.kycService.initiateCheck(body.userId);
    }

    @Post('webhook')
    handleWebhook(@Body() body: any) {
        return this.kycService.handleWebhook(body);
    }
}
