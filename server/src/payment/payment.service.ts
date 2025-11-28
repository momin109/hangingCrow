import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService) { }

    async initiateDeposit(userId: string, amount: number, provider: string) {
        // 1. Create pending transaction record (omitted for brevity, would be in a PaymentTxn model)
        // 2. Call provider API to get payment URL

        // Mock response
        return {
            paymentUrl: `https://sandbox.${provider}.com/pay?amount=${amount}&ref=${userId}`,
            trxId: 'MOCK_TRX_' + Date.now(),
        };
    }

    async handleWebhook(provider: string, payload: any) {
        // 1. Verify signature
        // 2. Find transaction
        // 3. Update transaction status
        // 4. Credit user wallet if success

        if (payload.status === 'SUCCESS') {
            const userId = payload.ref; // Assuming ref is userId for simplicity
            const amount = parseFloat(payload.amount);

            await this.prisma.$transaction(async (tx) => {
                await tx.wallet.update({
                    where: { userId },
                    data: {
                        balance: { increment: amount },
                        version: { increment: 1 },
                    },
                });
            });
        }

        return { status: 'ok' };
    }
}
