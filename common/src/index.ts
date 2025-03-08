import z from 'zod';

export const userSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(50),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().email(),
    password: z.string().min(8),
    current_streak: z.number().int().min(0),
    longest_streak: z.number().int().min(0),
    createdAt: z.date(),
    updatedAt: z.date()
});

export const activitySchema = z.object({
    id: z.string().uuid(),
    date: z.date(),
    description: z.array(z.string()),
    userId: z.string().uuid(),
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