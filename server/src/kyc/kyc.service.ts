import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KycService {
    constructor(private prisma: PrismaService) { }

    async initiateCheck(userId: string) {
        // Call Onfido API to create applicant and SDK token
        return {
            sdkToken: 'mock_sdk_token',
        };
    }

    async handleWebhook(payload: any) {
        // Update KycVerification status based on webhook
        return { status: 'ok' };
    }
}
