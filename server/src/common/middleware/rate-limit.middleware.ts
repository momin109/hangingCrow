import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from '@types/express';
import { ThrottlerException } from '@nestjs/throttler';

/**
 * Rate Limiting Middleware using in-memory store
 * For production, use Redis-based throttler
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private requestCounts = new Map<string, { count: number; resetTime: number }>();

    use(req: Request, res: Response, next: NextFunction) {
        const key = this.getKey(req);
        const limit = this.getLimit(req.path);
        const window = this.getWindow(req.path);

        const now = Date.now();
        const record = this.requestCounts.get(key);

        if (!record || now > record.resetTime) {
            // Reset window
            this.requestCounts.set(key, {
                count: 1,
                resetTime: now + window,
            });
            this.setHeaders(res, limit, limit - 1, window);
            next();
        } else if (record.count < limit) {
            // Increment count
            record.count++;
            this.setHeaders(res, limit, limit - record.count, window);
            next();
        } else {
            // Rate limit exceeded
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            this.setHeaders(res, limit, 0, window);
            throw new ThrottlerException('Too many requests, please try again later');
        }
    }

    private getKey(req: Request): string {
        // Combine IP and user ID (if authenticated)
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const userId = (req as any).user?.id || 'anonymous';
        return `${ip}:${userId}`;
    }

    private getLimit(path: string): number {
        // Different limits for different endpoints
        if (path.includes('/auth/login')) return 5;
        if (path.includes('/betting/place')) return 100;
        if (path.includes('/payment/deposit')) return 10;
        if (path.includes('/payment/withdraw')) return 5;
        return 300; // Default
    }

    private getWindow(path: string): number {
        // Time window in milliseconds
        if (path.includes('/auth/login')) return 15 * 60 * 1000; // 15 minutes
        if (path.includes('/payment')) return 60 * 60 * 1000; // 1 hour
        return 60 * 1000; // 1 minute default
    }

    private setHeaders(res: Response, limit: number, remaining: number, window: number) {
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', Date.now() + window);
    }

    // Cleanup old entries (call periodically)
    cleanup() {
        const now = Date.now();
        for (const [key, record] of this.requestCounts.entries()) {
            if (now > record.resetTime) {
                this.requestCounts.delete(key);
            }
        }
    }
}
