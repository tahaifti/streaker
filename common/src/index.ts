import z from 'zod';

export const userSchema = z.object({
    id: z.string().uuid({ message: 'Invalid user ID format' }),
    name: z.string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(30, { message: 'Username cannot exceed 30 characters' })
        .regex(/^[a-zA-Z0-9_-]+$/, { 
            message: 'Username can only contain letters, numbers, underscores, and hyphens' 
        }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    current_streak: z.number().int().min(0, { message: 'Streak cannot be negative' }),
    longest_streak: z.number().int().min(0, { message: 'Streak cannot be negative' }),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const activitySchema = z.object({
    id: z.string().uuid({ message: 'Invalid activity ID format' }),
    date: z.string().datetime().transform((val) => new Date(val)),
    description: z.string({ required_error: 'Description is required' }),
    userId: z.string().uuid({ message: 'Invalid user ID format' }),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const createUserSchema = z.object({
    name: userSchema.shape.name,
    username: userSchema.shape.username,
    email: userSchema.shape.email,
    password: userSchema.shape.password,
});

export const loginSchema = z.object({
    email: userSchema.shape.email,
    password: userSchema.shape.password,
})

export const updateUserSchema = createUserSchema.partial();

export const createActivitySchema = z.object({
    date: activitySchema.shape.date,
    description: activitySchema.shape.description,
});

export const updateActivitySchema = createActivitySchema.partial();

export const userResponseSchema = userSchema.omit({ password: true });

export const activityResponseSchema = activitySchema;

// Types 
export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;