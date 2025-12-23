import { Injectable, CanActivate, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class VpnGuard implements CanActivate {
    private readonly logger = new Logger(VpnGuard.name);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
        const userAgent = request.headers['user-agent'];

        // 1. Check for basic VPN headers
        // Cloudflare headers, etc.
        const country = request.headers['cf-ipcountry'];
        const isTor = request.headers['cf-ip-tor'] === 'true';

        if (isTor) {
            this.logger.warn(`Blocked TOR exit node usage from IP: ${ip}`);
            throw new ForbiddenException('Access via TOR is strictly prohibited.');
        }

        // 2. Simulated VPN detection logic
        // In production, this would call a service like IPQualityScore or MaxMind
        if (this.isSuspiciousIp(ip as string)) {
            this.logger.warn(`Blocked suspicious VPN IP: ${ip}`);
            throw new ForbiddenException('VPN/Proxy usage detected. Access denied.');
        }

        // 3. Device Fingerprint Check (Basic)
        const deviceId = request.headers['x-device-id'];
        if (!deviceId) {
            // In a strict mode, we might require this. For now, just log warning.
            // this.logger.warn(`Missing device ID from IP: ${ip}`);
        }

        return true;
    }

    private isSuspiciousIp(ip: string): boolean {
        // Placeholder for real VPN detection logic
        // Could check against a blacklist
        return false;
    }
}
