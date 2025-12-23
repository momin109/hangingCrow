import * as winston from 'winston';
import * as path from 'path';

/**
 * Winston Logger Configuration
 * Creates audit trails for all critical operations
 */

const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');

// Custom format for readable logs
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}] [${context || 'App'}] ${message}`;

        // Add metadata if present
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }

        return log;
    }),
);

// Create logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports: [
        // Error logs
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5,
        }),

        // Combined logs
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 10485760, // 10MB
            maxFiles: 10,
        }),

        // Auth logs (login, logout, etc.)
        new winston.transports.File({
            filename: path.join(logDir, 'auth.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 7,
        }),

        // Betting logs (place, settle, etc.)
        new winston.transports.File({
            filename: path.join(logDir, 'betting.log'),
            level: 'info',
            maxsize: 10485760, // 10MB
            maxFiles: 30,
        }),

        // Payment logs (deposit, withdraw)
        new winston.transports.File({
            filename: path.join(logDir, 'payment.log'),
            level: 'info',
            maxsize: 10485760, // 10MB
            maxFiles: 30,
        }),

        // Commission logs
        new winston.transports.File({
            filename: path.join(logDir, 'commission.log'),
            level: 'info',
            maxsize: 5242880, // 5MB
            maxFiles: 30,
        }),

        // Security logs (failed logins, unauthorized access)
        new winston.transports.File({
            filename: path.join(logDir, 'security.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 30,
        }),
    ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    );
}

// Helper functions for specific log types
export const logAuth = (message: string, meta?: any) => {
    logger.info(message, { context: 'Auth', ...meta });
};

export const logBetting = (message: string, meta?: any) => {
    logger.info(message, { context: 'Betting', ...meta });
};

export const logPayment = (message: string, meta?: any) => {
    logger.info(message, { context: 'Payment', ...meta });
};

export const logCommission = (message: string, meta?: any) => {
    logger.info(message, { context: 'Commission', ...meta });
};

export const logSecurity = (message: string, meta?: any) => {
    logger.warn(message, { context: 'Security', ...meta });
};

export default logger;
