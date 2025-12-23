import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

/**
 * Lock Service
 * Handles user locking with cascade - when parent is locked, all children are locked
 * Only OWNER or MOTHER can unlock
 */
@Injectable()
export class LockService {
    private readonly logger = new Logger(LockService.name);

    // Roles that can unlock users (highest privileges only)
    private readonly UNLOCK_ALLOWED_ROLES: Role[] = ['OWNER', 'MOTHER'];

    constructor(private prisma: PrismaService) { }

    /**
     * Lock a user and ALL descendants (cascade lock)
     * Also locks their wallets
     */
    async lockUser(
        userId: string,
        reason: string,
        lockedBy: string,
    ): Promise<{ lockedCount: number }> {
        this.logger.log(`Locking user ${userId} and descendants. Reason: ${reason}`);

        // Get all descendants
        const descendantIds = await this.getAllDescendants(userId);
        const allUserIds = [userId, ...descendantIds];

        // Lock all users in transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Lock all users
            const lockResult = await tx.user.updateMany({
                where: {
                    id: { in: allUserIds },
                    isLocked: false, // Only lock those not already locked
                },
                data: {
                    isLocked: true,
                    lockedAt: new Date(),
                    lockedReason: reason,
                    lockedBy: lockedBy,
                },
            });

            // Create audit log for each lock
            await tx.auditLog.createMany({
                data: allUserIds.map((uid) => ({
                    userId: lockedBy,
                    action: 'USER_LOCK',
                    targetId: uid,
                    targetType: 'USER',
                    meta: { reason, cascadeFrom: userId },
                })),
            });

            return lockResult.count;
        });

        this.logger.log(`Locked ${result} users (cascade from ${userId})`);
        return { lockedCount: result };
    }

    /**
     * Unlock a user - only OWNER or MOTHER allowed
     */
    async unlockUser(
        userId: string,
        requestingUserId: string,
        requestingUserRole: Role,
    ): Promise<void> {
        // Check permission
        if (!this.UNLOCK_ALLOWED_ROLES.includes(requestingUserRole)) {
            throw new ForbiddenException(
                `Only ${this.UNLOCK_ALLOWED_ROLES.join(' or ')} can unlock users`,
            );
        }

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new ForbiddenException('User not found');
        }

        if (!user.isLocked) {
            return; // Already unlocked
        }

        await this.prisma.$transaction(async (tx) => {
            // Unlock user
            await tx.user.update({
                where: { id: userId },
                data: {
                    isLocked: false,
                    lockedAt: null,
                    lockedReason: null,
                    lockedBy: null,
                },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    userId: requestingUserId,
                    action: 'USER_UNLOCK',
                    targetId: userId,
                    targetType: 'USER',
                    meta: { unlockedBy: requestingUserRole },
                },
            });
        });

        this.logger.log(`User ${userId} unlocked by ${requestingUserRole}`);
    }

    /**
     * Get all descendant user IDs (recursive)
     */
    async getAllDescendants(userId: string): Promise<string[]> {
        const descendants: string[] = [];

        const collectDescendants = async (parentId: string): Promise<void> => {
            const children = await this.prisma.user.findMany({
                where: { parentId, deletedAt: null },
                select: { id: true },
            });

            for (const child of children) {
                descendants.push(child.id);
                await collectDescendants(child.id);
            }
        };

        await collectDescendants(userId);
        return descendants;
    }

    /**
     * Check if user or any ancestor is locked
     * If any parent in chain is locked, user is effectively locked
     */
    async isUserOrAncestorLocked(userId: string): Promise<boolean> {
        // Check user first
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { isLocked: true, parentId: true },
        });

        if (!user) return true; // Non-existent user is treated as locked
        if (user.isLocked) return true;

        // Check ancestors
        let currentParentId = user.parentId;
        while (currentParentId) {
            const parent = await this.prisma.user.findUnique({
                where: { id: currentParentId },
                select: { isLocked: true, parentId: true },
            });

            if (!parent) break;
            if (parent.isLocked) return true;

            currentParentId = parent.parentId;
        }

        return false;
    }

    /**
     * Get lock status with details
     */
    async getLockStatus(userId: string): Promise<{
        isLocked: boolean;
        lockedAt?: Date;
        lockedReason?: string;
        lockedBy?: string;
        ancestorLocked?: string;
    }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                isLocked: true,
                lockedAt: true,
                lockedReason: true,
                lockedBy: true,
                parentId: true,
            },
        });

        if (!user) {
            return { isLocked: true, lockedReason: 'User not found' };
        }

        if (user.isLocked) {
            return {
                isLocked: true,
                lockedAt: user.lockedAt,
                lockedReason: user.lockedReason,
                lockedBy: user.lockedBy,
            };
        }

        // Check if locked via ancestor
        let currentParentId = user.parentId;
        while (currentParentId) {
            const parent = await this.prisma.user.findUnique({
                where: { id: currentParentId },
                select: { id: true, username: true, isLocked: true, parentId: true },
            });

            if (!parent) break;
            if (parent.isLocked) {
                return {
                    isLocked: true,
                    ancestorLocked: parent.id,
                    lockedReason: `Locked via ancestor: ${parent.username}`,
                };
            }

            currentParentId = parent.parentId;
        }

        return { isLocked: false };
    }

    /**
     * Get all locked users (for admin dashboard)
     */
    async getLockedUsers(limit = 50, offset = 0) {
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { isLocked: true },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    lockedAt: true,
                    lockedReason: true,
                    lockedBy: true,
                },
                orderBy: { lockedAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.user.count({ where: { isLocked: true } }),
        ]);

        return { data: users, total };
    }
}
