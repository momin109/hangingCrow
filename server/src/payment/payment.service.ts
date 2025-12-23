import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 * Payment Service - Handles deposits and withdrawals with atomic transactions
 */
@Injectable()
export class PaymentService {
    private readonly logger = new Logger(PaymentService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Deposit money into user wallet
     */
    async deposit(userId: string, amount: number) {
        this.logger.log(`Depositing ${amount} to user ${userId}`);

        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        return await this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });

            if (!wallet) {
                throw new BadRequestException('Wallet not found');
            }

            // Update wallet with optimistic locking
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId,
                    version: wallet.version
                },
                data: {
                    balance: {
                        increment: amount,
                    },
                    version: {
                        increment: 1,
                    },
                },
            });

            this.logger.log(`Deposit successful: ${amount} to ${userId}`);
            return updatedWallet;
        });
    }

    /**
     * Withdraw money from user wallet
     */
    async withdraw(userId: string, amount: number) {
        this.logger.log(`Withdrawing ${amount} from user ${userId}`);

        if (amount <= 0) {
            throw new BadRequestException('Amount must be positive');
        }

        return await this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });

            if (!wallet) {
                throw new BadRequestException('Wallet not found');
            }

            if (Number(wallet.balance) < amount) {
                throw new BadRequestException('Insufficient balance');
            }

            // Update wallet with optimistic locking
            const updatedWallet = await tx.wallet.update({
                where: {
                    userId,
                    version: wallet.version
                },
                data: {
                    balance: {
                        decrement: amount,
                    },
                    version: {
                        increment: 1,
                    },
                },
            });

            this.logger.log(`Withdrawal successful: ${amount} from ${userId}`);
            return updatedWallet;
        });
    }

    /**
     * Get user wallet balance
     */
    async getBalance(userId: string) {
        const wallet = await this.prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            throw new BadRequestException('Wallet not found');
        }

        return {
            balance: Number(wallet.balance),
            commissionBalance: Number(wallet.commissionBalance),
            currency: wallet.currency,
        };
    }
}
