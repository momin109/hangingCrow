import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from 'src/payment/payment.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
    let service: PaymentService;
    let prisma: PrismaService;

    const mockPrismaService = {
        $transaction: jest.fn(),
        wallet: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('deposit', () => {
        it('should deposit money successfully', async () => {
            const userId = 'user-123';
            const amount = 1000;

            const mockWallet = {
                userId,
                balance: 5000,
                version: 1,
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    wallet: {
                        findUnique: jest.fn().mockResolvedValue(mockWallet),
                        update: jest.fn().mockResolvedValue({ ...mockWallet, balance: 6000, version: 2 }),
                    },
                };
                return callback(tx);
            });

            const result = await service.deposit(userId, amount);

            expect(result.balance).toBe(6000);
            expect(mockPrismaService.$transaction).toHaveBeenCalled();
        });

        it('should handle concurrent deposits atomically', async () => {
            const userId = 'user-123';
            const initialBalance = 5000;

            // Simulate 10 concurrent deposits of 100 each
            const deposits = Array(10).fill(100);

            let currentBalance = initialBalance;
            let currentVersion = 1;

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    wallet: {
                        findUnique: jest.fn().mockResolvedValue({
                            userId,
                            balance: currentBalance,
                            version: currentVersion,
                        }),
                        update: jest.fn().mockImplementation(({ data }) => {
                            currentBalance += data.balance.increment;
                            currentVersion++;
                            return Promise.resolve({
                                userId,
                                balance: currentBalance,
                                version: currentVersion,
                            });
                        }),
                    },
                };
                return callback(tx);
            });

            // Execute all deposits
            await Promise.all(deposits.map(amount => service.deposit(userId, amount)));

            // Final balance should be initial + (10 * 100) = 6000
            expect(currentBalance).toBe(6000);
        });
    });

    describe('withdraw', () => {
        it('should withdraw money successfully', async () => {
            const userId = 'user-123';
            const amount = 1000;

            const mockWallet = {
                userId,
                balance: 5000,
                version: 1,
            };

            mockPrismaService.$transaction.mockImplementation(async (callback) => {
                const tx = {
                    wallet: {
                        findUnique: jest.fn().mockResolvedValue(mockWallet),
                        update: jest.fn().mockResolvedValue({ ...mockWallet, balance: 4000, version: 2 }),
                    },
                };
                return callback(tx);
            });

            const result = await service.withdraw(userId, amount);

            expect(result.balance).toBe(4000);
        });

        it('should prevent negative balance withdrawal', async () => {
            const userId = 'user-123';
            const amount = 10000;

            const mockWallet = {
                userId,
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

            await expect(service.withdraw(userId, amount)).rejects.toThrow('Insufficient balance');
        });
    });
});
