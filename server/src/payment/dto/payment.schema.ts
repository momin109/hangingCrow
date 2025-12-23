import { z } from 'zod';

/**
 * Zod Validation Schemas for Payment Operations
 * Prevents fraudulent transactions and ensures data integrity
 */

export const DepositSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    amount: z
        .number()
        .positive('Amount must be positive')
        .min(100, 'Minimum deposit is ₹100')
        .max(1000000, 'Maximum deposit is ₹1,000,000'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password too long'),
    method: z
        .enum(['BKASH', 'NAGAD', 'ROCKET', 'BANK', 'MANUAL'], {
            errorMap: () => ({ message: 'Invalid payment method' }),
        })
        .optional()
        .default('MANUAL'),
    reference: z.string().max(100).optional(),
});

export const WithdrawSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
    amount: z
        .number()
        .positive('Amount must be positive')
        .min(500, 'Minimum withdrawal is ₹500')
        .max(500000, 'Maximum withdrawal is ₹500,000'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password too long'),
    method: z
        .enum(['BKASH', 'NAGAD', 'ROCKET', 'BANK'], {
            errorMap: () => ({ message: 'Invalid payment method' }),
        })
        .optional()
        .default('BANK'),
    accountNumber: z.string().min(5).max(50).optional(),
});

export const GetBalanceSchema = z.object({
    userId: z.string().uuid('Invalid user ID format'),
});

export const GetTransactionHistorySchema = z.object({
    userId: z.string().uuid('Invalid user ID format').optional(),
    type: z.enum(['DEPOSIT', 'WITHDRAW', 'BET', 'WIN', 'COMMISSION']).optional(),
    limit: z.number().int().positive().max(100).optional().default(50),
    offset: z.number().int().min(0).optional().default(0),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

// Type exports for TypeScript
export type DepositDto = z.infer<typeof DepositSchema>;
export type WithdrawDto = z.infer<typeof WithdrawSchema>;
export type GetBalanceDto = z.infer<typeof GetBalanceSchema>;
export type GetTransactionHistoryDto = z.infer<typeof GetTransactionHistorySchema>;
