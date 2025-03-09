import { PrismaClient } from "@prisma/client/edge";
import { cache } from "hono/cache";
import { HTTPException } from "hono/http-exception";

export class ActivityService {
    constructor(private db: PrismaClient | any) { }

    async saveActivity(date: Date, description: string, userId: string) {
        try {
            const activityDate = new Date(date);
            activityDate.setUTCHours(0, 0, 0, 0);

            if (this.db.$cache) {
                const cacheKeyPatterns = [
                    `activity:findMany:${userId}:*`, // Invalidate all activity queries for the user
                    `user:${userId}`, // Invalidate user cache
                    `streak:${userId}`, // Invalidate streak cache
                ];

                for (const pattern of cacheKeyPatterns) {
                    await this.db.$cache.invalidate({ prefix: pattern });
                }
            }

            const activity = await this.db.activity.upsert({
                where: {
                    userId_date: {
                        userId,
                        date: activityDate,
                    }
                },
                update: {
                    description: {
                        push: description,
                    },
                },
                create: {
                    userId,
                    date: activityDate,
                    description: [description],
                },
                cacheStrategy: { skip: true } // Skip cache for this operation
            });

            // Update streaks after saving activity
            const current_streak = await this.getCurrentStreak(userId, true); // Skip cache for fresh data
            const longest_streak = await this.getLongestStreak(userId, true); // Skip cache for fresh data

            await this.db.user.update({
                where: { id: userId },
                data: {
                    current_streak,
                    longest_streak: Math.max(current_streak, longest_streak),
                },
                cacheStrategy: { skip: true } // Skip cache for update operation
            });

            return activity;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to save activity: ${error.message}` });
        }
    }

    async getActivities(userId: string, days: number, skipCache : boolean = false) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            return await this.db.activity.findMany({
                where: {
                    userId,
                    date: {
                        gte: startDate
                    }
                },
                orderBy: {
                    date: 'desc'
                },
                cacheStrategy: skipCache
                    ? { skip: true }
                    : {
                        ttl: 60,  // 1 minute
                        swr: 300  // 5 minutes
                    }
            })
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get activities: ${error.message}` });
        }
    }

    async getAllActivities(userId: string, page: number, limit: number, skipCache: boolean = false) {
        try {
            const cacheStrategy = skipCache
                ? { skip: true }
                : { ttl: 60, swr: 300 }; 
            // If limit is 0, fetch all activities without pagination
            if (limit === 0) {
                const activities = await this.db.activity.findMany({
                    where: {
                        userId,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    cacheStrategy
                });

                return {
                    activities,
                    totalActivities: activities.length,
                    totalPages: 1,
                    currentPage: 1,
                };
            }
            const skip = (page - 1) * limit;
            const activities = await this.db.activity.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
                cacheStrategy
            });

            const totalActivities = await this.db.activity.count({
                where: {
                    userId,
                },
                cacheStrategy: skipCache
                    ? { skip: true }
                    : { ttl: 300 } 
            });
            return {
                activities,
                totalActivities,
                totalPages: Math.ceil(totalActivities / limit),
                currentPage: page,
            };
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get all activities: ${error.message}` });
        }
    }

    async getCurrentStreak(userId: string, skipCache: boolean = false) {
        try {
            const activities = await this.db.activity.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    date: 'desc',
                },
                cacheStrategy: skipCache
                    ? { skip: true }
                    : { ttl: 60 }
            });

            let streak = 0;
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            // Check if there's any activity today
            const hasActivityToday: boolean = activities.some((activity: { date: Date | string }) => {
                const activityDate: Date = new Date(activity.date);
                return activityDate.getTime() === today.getTime();
            });

            if (activities.length === 0 || (!hasActivityToday &&
                new Date(activities[0].date).getTime() < today.getTime() - 24 * 60 * 60 * 1000)) {
                // Reset streak if no activity today and last activity was before yesterday
                await this.db.user.update({
                    where: { id: userId },
                    data: { current_streak: 0 },
                    cacheStrategy: { skip: true }
                });
                return 0;
            }

            for (let i = 0; i < activities.length - 1; i++) {
                const currentDate = new Date(activities[i].date);
                const nextDate = new Date(activities[i + 1].date);

                const diffDays = (currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24);

                if (i === 0) streak++;

                if (diffDays === 1) {
                    streak++;
                } else {
                    break;
                }
            }

            // Update current streak in database
            await this.db.user.update({
                where: { id: userId },
                data: {
                    current_streak: streak,
                    longest_streak: {
                        increment: streak > (await this.getLongestStreak(userId)) ? streak : 0
                    }
                },
                cacheStrategy: { skip: true }
            });

            return streak;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get current streak: ${error.message}` });
        }
    }

    getLongestStreak = async (userId: string, skipCache : boolean = false) => {
        try {
            const activities = await this.db.activity.findMany({
                where: {
                    userId, // Filter by userId
                },
                orderBy: {
                    date: 'asc', // Sort by date in ascending order
                },
                cacheStrategy: skipCache
                    ? { skip: true }
                    : { ttl: 300 }
            });

            let longestStreak = 0;
            let current_streak = 0;
            let previousDate: Date | null = null;

            for (const activity of activities) {
                const currentDate = new Date(activity.date);
                currentDate.setHours(0, 0, 0, 0); // Normalize the date to midnight

                if (previousDate === null) {
                    // First activity, start the streak
                    current_streak = 1;
                } else {
                    const diffTime = currentDate.getTime() - previousDate.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays === 1) {
                        // Consecutive day, increment the streak
                        current_streak++;
                    } else if (diffDays > 1) {
                        // Gap of more than 1 day, reset the streak
                        current_streak = 1;
                    }
                }

                // Update the longest streak if the current streak is longer
                if (current_streak > longestStreak) {
                    longestStreak = current_streak;
                }

                // Update the previous date
                previousDate = currentDate;
            }

            return longestStreak;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get longest streak: ${error.message}` });
        }
    }

    async invalidateUserCache(userId: string) {
        if (!this.db.$cache) return;
        
        const patterns = [
            `user:${userId}`,
            `activity:findMany:${userId}`,
            `streak:${userId}`
        ];
        
        await Promise.all(
            patterns.map(pattern => 
                this.db.$cache.invalidate({ prefix: pattern })
            )
        );
    }
}