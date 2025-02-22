import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";

export class ActivityService {
    constructor(private db : PrismaClient | any) { }

    async saveActivity(date: Date, description: string, userId: string){
        try {
            // console.log(`userId: ${userId}, date: ${date}, description: ${description}`);
            const activityDate = new Date(date);
            activityDate.setHours(0, 0, 0, 0);
            return await this.db.activity.upsert({
                where: {
                    userId_date: {
                        userId,
                        date: activityDate,
                    },
                },
                update: {
                    descriptions: {
                        push: description, // Append the new description to the array
                    },
                },
                create: {
                    userId,
                    date: activityDate,
                    descriptions: [description], // Create a new array with the description
                },
            });
        } catch (error : any) {
            throw new HTTPException(500, { message : `Failed to save activity ${error.message}` });
        }
    }

    async getActivities(userId : string, days : number){
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            return await this.db.activity.findMany({
            where : {
                userId,
                date : {
                gte : startDate
                }
            },
            orderBy : {
                date : 'desc'
            },
            })
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get activities: ${error.message}` });
        }
    }

    async getAllActivities(userId: string, page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;
            const activities =  await this.db.activity.findMany({
                where: {
                    userId,
                },
                orderBy : {
                    createdAt : 'desc',
                },
                skip,
                take: limit,
            });

            const totalActivities = await this.db.activity.count({
                where: {
                    userId,
                },
            });
            return {
                activities,
                totalActivities,
                totalPages: Math.ceil(totalActivities / limit),
                currentPage: page,
            };
        } catch (error : any) {
            throw new HTTPException(500, { message: `Failed to get all activities: ${error.message}` });
        }
    }

    async getCurrentStreak(userId: string) {
        try {
            const activities = await this.db.activity.findMany({
                where: {
                    userId,
                    date: {
                        lte: new Date(), // Only consider activities on or before today
                    },
                },
                orderBy: {
                    date: 'desc', // Sort by date in descending order
                },
            });
            // console.log(activities);
            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

            for (let i = 0; i < activities.length; i++) {
                const activityDate = new Date(activities[i].date);
                activityDate.setHours(0, 0, 0, 0); // Normalize activity date to midnight

                if (i === 0) {
                    // Check if the most recent activity is today or yesterday
                    const diffTime = today.getTime() - activityDate.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays > 1) {
                        // If the most recent activity is more than 1 day ago, no streak
                        break;
                    }
                } else {
                    // Check if the current activity is exactly 1 day before the previous activity
                    const prevDate = new Date(activities[i - 1].date);
                    prevDate.setHours(0, 0, 0, 0); // Normalize previous activity date to midnight

                    const diffTime = prevDate.getTime() - activityDate.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays !== 1) {
                        // If the gap between activities is not exactly 1 day, break the streak
                        break;
                    }
                }

                streak++; // Increment the streak
            }

            return streak;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get current streak: ${error.message}` });
        }
    }

    getLongestStreak = async (userId: string) => {
        try {
            const activities = await this.db.activity.findMany({
                where: {
                    userId, // Filter by userId
                },
                orderBy: {
                    date: 'asc', // Sort by date in ascending order
                },
            });

            let longestStreak = 0;
            let currentStreak = 0;
            let previousDate: Date | null = null;

            for (const activity of activities) {
                const currentDate = new Date(activity.date);
                currentDate.setHours(0, 0, 0, 0); // Normalize the date to midnight

                if (previousDate === null) {
                    // First activity, start the streak
                    currentStreak = 1;
                } else {
                    const diffTime = currentDate.getTime() - previousDate.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    if (diffDays === 1) {
                        // Consecutive day, increment the streak
                        currentStreak++;
                    } else if (diffDays > 1) {
                        // Gap of more than 1 day, reset the streak
                        currentStreak = 1;
                    }
                }

                // Update the longest streak if the current streak is longer
                if (currentStreak > longestStreak) {
                    longestStreak = currentStreak;
                }

                // Update the previous date
                previousDate = currentDate;
            }

            return longestStreak;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get longest streak: ${error.message}` });
        }
    }
}