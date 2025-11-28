import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { isRoleAtLeast } from '../auth/guards/roles.guard';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findAll(requestingUserRole: Role, tenantId: string, page = 1, limit = 10) {
        // Only admin and above can view all users
        if (!isRoleAtLeast(requestingUserRole, 'ADMIN' as Role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    tenantId,
                    deletedAt: null
                },
                skip,
                take: limit,
                select: {
                    id: true,
                    username: true,
                    role: true,
                    createdAt: true,
                    wallet: {
                        select: {
                            balance: true,
                            commissionBalance: true,
                        },
                    },
                    parent: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    bets: {
                        where: {
                            status: 'PENDING'
                        },
                        select: {
                            stake: true
                        }
                    },
                    _count: {
                        select: {
                            children: true
                        }
                    }
                },
            }),
            this.prisma.user.count({
                where: {
                    tenantId,
                    deletedAt: null
                }
            })
        ]);

        return {
            data: users.map(user => {
                const exposure = user.bets.reduce((sum, bet) => sum + Number(bet.stake), 0);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { bets, ...rest } = user;
                return {
                    ...rest,
                    exposure,
                    availableBalance: Number(user.wallet?.balance || 0) - exposure,
                    totalChildren: user._count.children
                };
            }),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: string, requestingUserId: string, requestingUserRole: Role) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                wallet: true,
                kyc: true,
                parent: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
                children: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Users can see their own profile, admins can see anyone
        if (user.id !== requestingUserId && !isRoleAtLeast(requestingUserRole, 'ADMIN' as Role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        // Don't send password hash
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateBalance(
        userId: string,
        amount: number,
        requestingUserId: string,
        requestingUserRole: Role,
    ) {
        // Only agents and above can modify balances
        if (!isRoleAtLeast(requestingUserRole, 'AGENT' as Role)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { wallet: true },
        });
        return this.prisma.wallet.update({
            where: { userId },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
    }

    async createUser(
        username: string,
        password: string,
        role: Role,
        parentId: string | null,
        requestingUserRole: Role,
        tenantId: string,
    ) {
        // Only admin and above can create users
        if (!isRoleAtLeast(requestingUserRole, 'ADMIN' as Role)) {
            // Agents can create users but only USER role
            if (role !== 'USER') {
                throw new ForbiddenException('Can only create USER role accounts');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                parentId,
                tenantId,
                wallet: {
                    create: {
                        currency: 'BDT',
                    },
                },
            },
            select: {
                id: true,
                username: true,
                role: true,
                createdAt: true,
            },
        });
    }

    async getDownlineTree(userId: string, requestingUserId: string, requestingUserRole: Role) {
        // Check permissions
        if (userId !== requestingUserId && !isRoleAtLeast(requestingUserRole, 'ADMIN' as Role)) {
            throw new ForbiddenException('Can only view your own downline');
        }

        const buildTree = async (parentId: string): Promise<any> => {
            const children = await this.prisma.user.findMany({
                where: {
                    parentId,
                    deletedAt: null,
                },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    createdAt: true,
                    wallet: {
                        select: {
                            balance: true,
                            commissionBalance: true,
                        },
                    },
                },
            });

            return Promise.all(
                children.map(async (child) => ({
                    ...child,
                    children: await buildTree(child.id),
                }))
            );
        };

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                role: true,
                wallet: {
                    select: {
                        balance: true,
                        commissionBalance: true,
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            ...user,
            children: await buildTree(userId),
        };
    }
}
