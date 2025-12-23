import { Test, TestingModule } from '@nestjs/testing';
import { AntiCheatService } from '../src/anti-cheat/anti-cheat.service';
import { LockService } from '../src/user/lock.service';
import { RiskEngineService } from '../src/risk/risk-engine.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuditService } from '../src/common/audit.service';
import { ForbiddenException } from '@nestjs/common';

describe('Production Hardening Tests', () => {
    let antiCheatService: AntiCheatService;
    let lockService: LockService;
    let riskService: RiskEngineService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
        bet: {
            count: jest.fn(),
            findMany: jest.fn(),
            aggregate: jest.fn(),
            groupBy: jest.fn(),
        },
        auditLog: {
            findMany: jest.fn(),
            create: jest.fn(),
            createMany: jest.fn(),
            aggregate: jest.fn(),
            count: jest.fn(),
        },
        riskReport: {
            create: jest.fn(),
            aggregate: jest.fn(),
            count: jest.fn(),
            findMany: jest.fn(),
        },
        $transaction: jest.fn((cb) => cb(mockPrismaService)),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AntiCheatService,
                LockService,
                RiskEngineService,
                AuditService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        antiCheatService = module.get<AntiCheatService>(AntiCheatService);
        lockService = module.get<LockService>(LockService);
        riskService = module.get<RiskEngineService>(RiskEngineService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('AntiCheatService', () => {
        it('should throw error for rapid betting', async () => {
            // Mock bet count to exceed limit
            mockPrismaService.bet.count.mockResolvedValue(5);

            await expect(
                antiCheatService.checkRapidBetting('user1', 'market1'),
            ).rejects.toThrow(ForbiddenException);

            expect(mockPrismaService.riskReport.create).toHaveBeenCalled();
        });

        it('should detect abnormal win rate', async () => {
            mockPrismaService.user.findMany.mockResolvedValue([{ id: 'child1' }]);
            mockPrismaService.bet.count
                .mockResolvedValueOnce(100) // Total bets
                .mockResolvedValueOnce(90); // Won bets (90% win rate)

            const isAbnormal = await antiCheatService.detectAbnormalWinRate('agent1');
            expect(isAbnormal).toBe(true);
            expect(mockPrismaService.riskReport.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ reason: 'ABNORMAL_WIN_RATE' }),
                }),
            );
        });
    });

    describe('LockService', () => {
        it('should cascade lock to descendants', async () => {
            // Mock descendants
            mockPrismaService.user.findMany.mockResolvedValueOnce([{ id: 'child1' }]); // First level
            mockPrismaService.user.findMany.mockResolvedValueOnce([]); // No children of child1

            mockPrismaService.user.updateMany.mockResolvedValue({ count: 2 });

            await lockService.lockUser('parent1', 'Suspicious activity', 'admin');

            expect(mockPrismaService.user.updateMany).toHaveBeenCalledWith({
                where: {
                    id: { in: ['parent1', 'child1'] },
                    isLocked: false,
                },
                data: expect.any(Object),
            });
            expect(mockPrismaService.auditLog.createMany).toHaveBeenCalled();
        });

        it('should verify ancestor locking', async () => {
            // User not locked, but parent locked
            mockPrismaService.user.findUnique
                .mockResolvedValueOnce({ isLocked: false, parentId: 'parent1' }) // User
                .mockResolvedValueOnce({ isLocked: true, parentId: null }); // Parent

            const isLocked = await lockService.isUserOrAncestorLocked('user1');
            expect(isLocked).toBe(true);
        });
    });

    describe('RiskEngineService', () => {
        it('should auto-lock suspicious agents', async () => {
            mockPrismaService.user.findMany.mockResolvedValue([{ id: 'agent1' }]);

            // Mock abnormal win rate detection logic
            jest.spyOn(antiCheatService, 'detectAbnormalWinRate').mockResolvedValue(true);
            jest.spyOn(antiCheatService, 'shouldAutoLock').mockResolvedValue(true);
            jest.spyOn(lockService, 'lockUser').mockResolvedValue({ lockedCount: 1 });

            await riskService.checkAgentWinRates();

            expect(lockService.lockUser).toHaveBeenCalledWith(
                'agent1',
                expect.stringContaining('AUTO_LOCK'),
                'SYSTEM',
            );
        });
    });
});
