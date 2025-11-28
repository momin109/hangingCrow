import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        const hasRole = requiredRoles.some((role) => isRoleAtLeast(user.role, role));

        if (!hasRole) {
            throw new ForbiddenException(
                `Access denied. Required roles: ${requiredRoles.join(', ')} (or higher). Your role: ${user.role}`
            );
        }

        return true;
    }
}

// Helper function to check role hierarchy
export function isRoleAtLeast(userRole: Role, minimumRole: Role): boolean {
    const hierarchy: Role[] = [
        'OWNER',
        'MOTHER',
        'WHITELABEL',
        'SUPERADMIN',
        'ADMIN',
        'B2C_SUBADMIN',
        'B2B_SUBADMIN',
        'SENIOR_AFFILIATE',
        'AFFILIATE',
        'SUPER_AGENT',
        'MASTER_AGENT',
        'AGENT',
        'USER'
    ];

    const userLevel = hierarchy.indexOf(userRole);
    const minimumLevel = hierarchy.indexOf(minimumRole);

    return userLevel <= minimumLevel;
}
