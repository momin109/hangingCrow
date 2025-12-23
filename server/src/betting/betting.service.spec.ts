import { Test, TestingModule } from '@nestjs/testing';
import { BettingService } from './betting.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommissionService } from '../commission/commission.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BettingService', () => {
    let service: BettingService;
    let prisma: PrismaService;
    let commission: CommissionService;

    const mockPrismaService = {
        $transaction: jest.fn(),
        bet: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            groupBy: jest.fn(),
            aggregate: jest.fn(),
        },
        wallet: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
        betSettle: {
            create: jest.fn(),
        },
    };

    const mockCommissionService = {
        distributeCommission: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BettingService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: CommissionService, useValue: mockCommissionService },
            ],
        }).compile();

        service = module.get<BettingService>(BettingService);
        prisma = module.get<PrismaService>(PrismaService);
        commission = module.get<CommissionService>(CommissionService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('placeBet', () => {
        it('should place bet successfully with sufficient balance', async () => {
            const betData = {
                userId: 'user-123',
                marketId: 'market-456',
                selectionId: 'selection-789',
                odds: 2.5,
                stake: 1000,
            };

            const mockWallet = {
                userId: 'user-123',
                balance: 5000,
                version: 1,
            };

            const mockUser = {
                id: 'user-123',
                tenantId: 'tenant-1',
            };

            const mockBet = {
                id: 'bet-abc',
                ...betData,
                potentialWin: 2500,
                status: 'PENDING',
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    wallet: {
                        findUnique: jest.fn().mockResolvedValue(mockWallet),
                        update: jest.fn().mockResolvedValue({ ...mockWallet, balance: 4000 }),
                    },
                    user: {
                        findUnique: jest.fn().mockResolvedValue(mockUser),
                    },
                    bet: {
                        create: jest.fn().mockResolvedValue(mockBet),
                    },
                };
                return callback(tx);
            });

            const result = await service.placeBet(betData);

            expect(result).toEqual(mockBet);
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should throw BadRequestException for insufficient balance', async () => {
            const betData = {
                userId: 'user-123',
                marketId: 'market-456',
                selectionId: 'selection-789',
                odds: 2.5,
                stake: 10000,
            };

            const mockWallet = {
                userId: 'user-123',
                balance: 500,
                version: 1,
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    wallet: {
                        findUnique: jest.fn().mockResolvedValue(mockWallet),
                    },
                };
                return callback(tx);
            });

            await expect(service.placeBet(betData)).rejects.toThrow(BadRequestException);
        });

        it('should validate minimum stake amount', async () => {
            const betData = {
                userId: 'user-123',
                marketId: 'market-456',
                selectionId: 'selection-789',
                odds: 2.5,
                stake: 5, // Below minimum of 10
            };

            await expect(service.placeBet(betData)).rejects.toThrow('Minimum stake is ₹10');
        });

        it('should validate maximum stake amount', async () => {
            const betData = {
                userId: 'user-123',
                marketId: 'market-456',
                selectionId: 'selection-789',
                odds: 2.5,
                stake: 150000, // Above maximum of 100,000
            };

            await expect(service.placeBet(betData)).rejects.toThrow('Maximum stake is ₹100,000');
        });
    });

    describe('settleBet', () => {
        it('should settle bet as WON and trigger commission', async () => {
            const betId = 'bet-123';
            const mockBet = {
                id: betId,
                userId: 'user-456',
                stake: 1000,
                potentialWin: 2500,
                status: 'PENDING',
                user: { id: 'user-456' },
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    bet: {
                        findUnique: jest.fn().mockResolvedValue(mockBet),
                        update: jest.fn().mockResolvedValue({ ...mockBet, status: 'WON' }),
                    },
                    wallet: {
                        update: jest.fn().mockResolvedValue({}),
                    },
                    betSettle: {
                        create: jest.fn().mockResolvedValue({}),
                    },
                };
                return callback(tx);
            });

            const result = await service.settleBet(betId, 'WON');

            expect(result.payout).toBe(2500);
            expect(result.profitLoss).toBe(1500);
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should settle bet as LOST and distribute commission', async () => {
            const betId = 'bet-123';
            const mockBet = {
                id: betId,
                userId: 'user-456',
                stake: 1000,
                potentialWin: 2500,
                status: 'PENDING',
                user: { id: 'user-456' },
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    bet: {
                        findUnique: jest.fn().mockResolvedValue(mockBet),
                        update: jest.fn().mockResolvedValue({ ...mockBet, status: 'LOST' }),
                    },
                    wallet: {
                        update: jest.fn(),
                    },
                    betSettle: {
                        create: jest.fn().mockResolvedValue({}),
                    },
                };
                return callback(tx);
            });

            const result = await service.settleBet(betId, 'LOST');

            expect(result.payout).toBe(0);
            expect(result.profitLoss).toBe(-1000);

            // Commission should be triggered (async, so wait a bit)
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(mockCommissionService.distributeCommission).toHaveBeenCalledWith(
                'user-456',
                1000,
                expect.anything()
            );
        });

        it('should throw NotFoundException for non-existent bet', async () => {
            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    bet: {
                        findUnique: jest.fn().mockResolvedValue(null),
                    },
                };
                return callback(tx);
            });

            await expect(service.settleBet('invalid-bet', 'WON')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException for already settled bet', async () => {
            const mockBet = {
                id: 'bet-123',
                status: 'WON', // Already settled
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    bet: {
                        findUnique: jest.fn().mockResolvedValue(mockBet),
                    },
                };
                return callback(tx);
            });

            await expect(service.settleBet('bet-123', 'WON')).rejects.toThrow('Bet already settled');
        });

        it('should handle VOID result correctly (return stake)', async () => {
            const betId = 'bet-123';
            const mockBet = {
                id: betId,
                userId: 'user-456',
                stake: 1000,
                potentialWin: 2500,
                status: 'PENDING',
                user: { id: 'user-456' },
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    bet: {
                        findUnique: jest.fn().mockResolvedValue(mockBet),
                        update: jest.fn().mockResolvedValue({ ...mockBet, status: 'VOID' }),
                    },
                    wallet: {
                        update: jest.fn().mockResolvedValue({}),
                    },
                    betSettle: {
                        create: jest.fn().mockResolvedValue({}),
                    },
                };
                return callback(tx);
            });

            const result = await service.settleBet(betId, 'VOID');

            expect(result.payout).toBe(1000);
            expect(result.profitLoss).toBe(0);
        });
    });

    describe('getUserExposure', () => {
        it('should calculate total exposure correctly', async () => {
            mockPrismaService.bet.aggregate.mockResolvedValue({
                _sum: {
                    stake: 5000,
                    potentialWin: 12500,
                },
                _count: 3,
            });

            const result = await service.getUserExposure('user-123');

            expect(result).toEqual({
                pendingBets: 3,
                totalStake: 5000,
                totalExposure: 12500,
            });
        });
    });

    describe('getTopPlayers', () => {
        it('should return top players by exposure', async () => {
            const mockGroupBy = [
                {
                    userId: 'user-1',
                    _sum: {
                        stake: 10000,
                        potentialWin: 25000,
                    },
                },
                {
                    userId: 'user-2',
                    _sum: {
                        stake: 8000,
                        potentialWin: 20000,
                    },
                },
            ];

            mockPrismaService.bet.groupBy.mockResolvedValue(mockGroupBy);
            mockPrismaService.user.findUnique
                .mockResolvedValueOnce({ id: 'user-1', username: 'player1', role: 'USER' })
                .mockResolvedValueOnce({ id: 'user-2', username: 'player2', role: 'USER' });

            const result = await service.getTopPlayers(10);

            expect(result).toHaveLength(2);
            expect(result[0].totalExposure).toBe(25000);
        });
    });
});
