import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BettingService {
    constructor(private prisma: PrismaService) { }

    async placeBet(userId: string, tenantId: string, dto: PlaceBetDto) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Lock wallet and check balance
            const wallet = await tx.wallet.findUnique({
                where: { userId },
            });

            if (!wallet) throw new BadRequestException('Wallet not found');
            if (wallet.balance.toNumber() < dto.stake) {
                throw new BadRequestException('Insufficient balance');
            }

            // 2. Deduct stake
            const updatedWallet = await tx.wallet.update({
                where: { userId, version: wallet.version },
                data: {
                    balance: { decrement: dto.stake },
                    version: { increment: 1 },
                },
            });

            // 3. Create Bet
            const bet = await tx.bet.create({
                data: {
                    userId,
                    tenantId,
                    marketId: dto.marketId,
                    selectionId: dto.selectionId,
                    odds: dto.odds,
                    stake: dto.stake,
                    potentialWin: dto.stake * dto.odds,
                    status: 'PENDING',
                },
            });

            return bet;
        });
    }

    async settleBet(betId: string, outcome: 'WIN' | 'LOSS' | 'VOID') {
        return this.prisma.$transaction(async (tx) => {
            const bet = await tx.bet.findUnique({ where: { id: betId } });
            if (!bet) throw new BadRequestException('Bet not found');
            if (bet.status !== 'PENDING') throw new BadRequestException('Bet already settled');

            let winAmount = 0;
            let status = 'LOST';

            if (outcome === 'WIN') {
                winAmount = bet.potentialWin.toNumber();
                status = 'WON';
            } else if (outcome === 'VOID') {
                winAmount = bet.stake.toNumber();
                status = 'VOID';
            }

            // Update Bet Status
            await tx.bet.update({
                where: { id: betId },
                data: { status, settledAt: new Date() },
            });

            // Create Settlement Record
            await tx.betSettle.create({
                data: {
                    betId,
                    amount: winAmount,
                    type: outcome,
                },
            });

            // Credit Wallet if WIN or VOID
            if (winAmount > 0) {
                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: {
                        balance: { increment: winAmount },
                        version: { increment: 1 },
                    },
                });
            }

            return { betId, status, winAmount };
        });
    }
}
