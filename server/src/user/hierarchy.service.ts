import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

/**
 * Hierarchy Service - Manages the 8-layer role structure
 * Handles parent-child relationships and permission checks
 */
@Injectable()
export class HierarchyService {
    // Role hierarchy definition (lower number = higher authority)
    private readonly ROLE_HIERARCHY: Record<Role, number> = {
        OWNER: 1,
        MOTHER: 2,
        WHITELABEL: 3,
        SUPERADMIN: 4,
        ADMIN: 5,
        B2C_SUBADMIN: 6,
        B2B_SUBADMIN: 6, // Same level as B2C
        SENIOR_AFFILIATE: 7,
        AFFILIATE: 8,
        SUPER_AGENT: 9,
        MASTER_AGENT: 10,
        AGENT: 11,
        USER: 12,
    };

    constructor(private prisma: PrismaService) { }

    /**
     * Get all ancestors (parents) from user to OWNER
     */
    async getAncestors(userId: string): Promise<any[]> {
        const ancestors = [];
        let currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { parent: true },
        });

        while (currentUser?.parent) {
            ancestors.push(currentUser.parent);
            currentUser = await this.prisma.user.findUnique({
                where: { id: currentUser.parent.id },
                include: { parent: true },
            });
        }

        return ancestors;
    }

    /**
     * Get all descendants (children) recursively
     */
    async getDescendants(userId: string): Promise<any[]> {
        const descendants = [];
        const queue = [userId];

        while (queue.length > 0) {
            const currentId = queue.shift();
            const children = await this.prisma.user.findMany({
                where: { parentId: currentId },
                include: { wallet: true },
            });

            for (const child of children) {
                descendants.push(child);
                queue.push(child.id);
            }
        }

        return descendants;
    }

    /**
     * Check if manager can manage target user
     */
    async canManage(managerId: string, targetId: string): Promise<boolean> {
        if (managerId === targetId) return true;

        const manager = await this.prisma.user.findUnique({
            where: { id: managerId },
        });
        const target = await this.prisma.user.findUnique({
            where: { id: targetId },
        });

        if (!manager || !target) return false;

        // Higher role (lower number) can manage lower role (higher number)
        if (this.ROLE_HIERARCHY[manager.role] > this.ROLE_HIERARCHY[target.role]) {
            return false;
        }

        // Check if target is in manager's downline
        const ancestors = await this.getAncestors(targetId);
        return ancestors.some((ancestor) => ancestor.id === managerId);
    }

    /**
     * Get hierarchy depth (distance from OWNER)
     */
    async getHierarchyDepth(userId: string): Promise<number> {
        const ancestors = await this.getAncestors(userId);
        return ancestors.length;
    }

    /**
     * Validate parent-child relationship before creation
     */
    async validateParentChild(parentId: string, childRole: Role): Promise<boolean> {
        const parent = await this.prisma.user.findUnique({
            where: { id: parentId },
        });

        if (!parent) return false;

        // Parent must be higher in hierarchy than child
        const parentLevel = this.ROLE_HIERARCHY[parent.role];
        const childLevel = this.ROLE_HIERARCHY[childRole];

        return parentLevel < childLevel;
    }

    /**
     * Get role level (for comparison)
     */
    getRoleLevel(role: Role): number {
        return this.ROLE_HIERARCHY[role];
    }

    /**
     * Check if role1 is higher than role2
     */
    isHigherRole(role1: Role, role2: Role): boolean {
        return this.ROLE_HIERARCHY[role1] < this.ROLE_HIERARCHY[role2];
    }

    /**
     * Get downline tree structure (formatted for frontend)
     */
    async getDownlineTree(userId: string) {
        const buildTree = async (parentId: string): Promise<any> => {
            const children = await this.prisma.user.findMany({
                where: { parentId },
                include: {
                    wallet: true,
                    kyc: true
                },
                orderBy: { createdAt: 'desc' },
            });

            const childrenWithSubtree = await Promise.all(
                children.map(async (child) => ({
                    id: child.id,
                    username: child.username,
                    role: child.role,
                    balance: child.wallet?.balance || 0,
                    commissionBalance: child.wallet?.commissionBalance || 0,
                    kycStatus: child.kyc?.status || 'PENDING',
                    createdAt: child.createdAt,
                    children: await buildTree(child.id),
                })),
            );

            return childrenWithSubtree;
        };

        const root = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { wallet: true, kyc: true },
        });

        return {
            ...root,
            children: await buildTree(userId),
        };
    }
}
