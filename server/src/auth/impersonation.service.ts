import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Impersonation Service - Allows OWNER/ADMIN to view platform as any user
 */
@Injectable()
export class ImpersonationService {
    private readonly logger = new Logger(ImpersonationService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * Generate temporary impersonation token
     * Allows higher-level users to view the platform as a lower-level user
     */
    async generateImpersonationToken(impersonatorId: string, targetUserId: string): Promise<string> {
        this.logger.log(`User ${impersonatorId} requesting impersonation of ${targetUserId}`);

        // Get both users
        const [impersonator, targetUser] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: impersonatorId } }),
            this.prisma.user.findUnique({ where: { id: targetUserId } }),
        ]);

        if (!impersonator || !targetUser) {
            throw new UnauthorizedException('Invalid users');
        }

        // Role hierarchy check (prevent lower roles from impersonating higher roles)
        const roleHierarchy: Record<string, number> = {
            OWNER: 1,
            MOTHER: 2,
            WHITELABEL: 3,
            SUPERADMIN: 4,
            ADMIN: 5,
            B2C_SUBADMIN: 6,
            B2B_SUBADMIN: 6,
            SENIOR_AFFILIATE: 7,
            AFFILIATE: 8,
            SUPER_AGENT: 9,
            MASTER_AGENT: 10,
            AGENT: 11,
            USER: 12,
        };

        const impersonatorLevel = roleHierarchy[impersonator.role];
        const targetLevel = roleHierarchy[targetUser.role];

        if (impersonatorLevel >= targetLevel) {
            throw new UnauthorizedException('Cannot impersonate equal or higher role');
        }

        // Generate temporary token (1 hour expiry)
        const payload = {
            sub: impersonator.id, // Real user ID
            username: impersonator.username,
            role: impersonator.role,
            impersonatedUser: targetUser.id, // Target user ID
            impersonatedUsername: targetUser.username,
            impersonatedRole: targetUser.role,
            type: 'impersonation',
        };

        const token = this.jwtService.sign(payload, {
            expiresIn: '1h', // 1 hour session
        });

        // Log impersonation event (audit trail)
        this.logger.warn(
            `IMPERSONATION: ${impersonator.username} (${impersonator.role}) viewing as ${targetUser.username} (${targetUser.role})`,
        );

        // TODO: Store in database for audit
        // await this.prisma.impersonationLog.create({...})

        return token;
    }

    /**
     * Validate impersonation token
     */
    async validateImpersonationToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            if (payload.type !== 'impersonation') {
                throw new UnauthorizedException('Not an impersonation token');
            }

            // Check if token is expired
            const now = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < now) {
                throw new UnauthorizedException('Impersonation session expired');
            }

            return payload;
        } catch (error) {
            throw new UnauthorizedException('Invalid impersonation token');
        }
    }

    /**
     * Get impersonation history for audit
     */
    async getImpersonationHistory(userId: string, limit: number = 50) {
        // TODO: Implement with dedicated impersonation log table
        this.logger.log(`Fetching impersonation history for user ${userId}`);
        return [];
    }

    /**
     * End impersonation session
     */
    async endImpersonation(impersonatorId: string) {
        this.logger.log(`User ${impersonatorId} ending impersonation session`);
        // Token will naturally expire, but we log the explicit end
        return { message: 'Impersonation session ended' };
    }
}
