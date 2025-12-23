import { z } from 'zod';

/**
 * Zod Validation Schemas for Betting Operations
 * Prevents injection attacks and ensures data integrity
 */

export const PlaceBetSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    marketId: z.string().uuid('Invalid market ID format'),
    selectionId: z.string().uuid('Invalid selection ID format'),
    odds: z
        .number()
        .min(1.01, 'Minimum odds is 1.01')
        .max(1000, 'Maximum odds is 1000'),
    stake: z
        .number()
        .positive('Stake must be positive')
        .min(10, 'Minimum stake is ₹10')
        .max(100000, 'Maximum stake is ₹100,000'),
    betType: z.enum(['BACK', 'LAY']).optional().default('BACK'),
});

export const SettleBetSchema = z.object({
    betId: z.string().uuid('Invalid bet ID format'),
    result: z.enum(['WON', 'LOST', 'VOID', 'HALF_WON', 'HALF_LOST'], {
        errorMap: () => ({ message: 'Invalid bet result' }),
    }),
});

export const GetBetHistorySchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    status: z.enum(['PENDING', 'WON', 'LOST', 'VOID']).optional(),
    limit: z.number().int().positive().max(100).optional().default(50),
    offset: z.number().int().min(0).optional().default(0),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export const GetLiveBetsSchema = z.object({
    tenantId: z.string().uuid().optional(),
    limit: z.number().int().positive().max(500).optional().default(100),
});

// Type exports for TypeScript
export type PlaceBetDto = z.infer<typeof PlaceBetSchema>;
export type SettleBetDto = z.infer<typeof SettleBetSchema>;
export type GetBetHistoryDto = z.infer<typeof GetBetHistorySchema>;
export type GetLiveBetsDto = z.infer<typeof GetLiveBetsSchema>;
