import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionType } from '@prisma/client';

@Injectable()
export class CommissionService {
    constructor(private prisma: PrismaService) { }

    async processCommission(userId: string, amount: number, type: CommissionType) {
        // 1. Get User Hierarchy
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                parent: {
                    include: {
                        parent: {
                            include: {
                                parent: true, // Go up 3 levels for now, ideally recursive or CTE
                            },
                        },
                    },
                },
            },
        });

        if (!user || !user.parent) return;

        // 2. Traverse and Distribute
        let currentAncestor: any = user.parent;
        let level = 1;
        let remainingCommission = amount * 0.05; // Base 5% example, should come from config

        await this.prisma.$transaction(async (tx) => {
            while (currentAncestor && remainingCommission > 0) {
                // Apply decay: 50% decay per ancestor level if not direct parent
                const share = level === 1 ? remainingCommission : remainingCommission * 0.5;

                // Credit Commission Wallet
                await tx.wallet.update({
                    where: { userId: currentAncestor.id },
                    data: {
                        commissionBalance: { increment: share },
                        version: { increment: 1 },
                    },
                });

                // Record Transaction
                await tx.commissionTxn.create({
                    data: {
                        userId: currentAncestor.id,
                        sourceUserId: userId,
                        amount: share,
                        type,
                        level,
                    },
                });

                remainingCommission -= share;
                currentAncestor = currentAncestor.parent;
                level++;
            }
        });
    }
}
