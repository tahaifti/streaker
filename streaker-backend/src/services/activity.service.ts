import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";

export class ActivityService {
    constructor(private db : PrismaClient | any) { }

    async saveActivity(date: Date, description: string, userId: string){
        try {
            // console.log(`userId: ${userId}, date: ${date}, description: ${description}`);
            return await this.db.activity.upsert({
                where : {
                    userId_date : {
                        userId,
                        date : new Date(date)
                    },
                },
                update : {
                    description
                },
                create : {
                    userId,
                    date : new Date(date),
                    description,
                    
                },
            })
        } catch (error : any) {
            throw new HTTPException(500, { message : `Failed to save activity ${error.message}` });
        }
    }

    async getActivities(userId : string, days : number){
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
    }

    getCurrentStreak = async (userId : string) => {
        const activities = await this.db.activity.findMany({
            where : {
                userId,
                date : {
                    lte : new Date()
                }
            },
            orderBy : {
                date : 'desc'
            }
        })
        let streak = 0;
        const today = new Date();
        today.setHours(0,0,0,0);

        for(let i = 0; i < activities.length; i++){
            const acvtivityDate = new Date(activities[i].date);
            acvtivityDate.setHours(0,0,0,0);

            if(i == 0){
                const diffTime = today.getTime() - acvtivityDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if(diffDays > 1) break;
            }else {
                const prevDate = new Date(activities[i - 1].date);
                prevDate.setHours(0,0,0,0);
                const diffTime = prevDate.getTime() - acvtivityDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                if(diffDays !== 1) break;
            }
            streak++;
        }
        return streak;
    }
}