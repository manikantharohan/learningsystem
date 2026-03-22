import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const progressUpdateSchema = z.object({
    lastPositionSeconds: z.number().min(0).optional(),
    isCompleted: z.boolean().optional(),
});

export const aiChatSchema = z.object({
    message: z.string().min(1, 'Message is required'),
    context: z.object({
        videoId: z.string().optional(),
        subjectId: z.string().optional(),
    }).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
export type AIChatInput = z.infer<typeof aiChatSchema>;
