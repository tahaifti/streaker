import { Context } from "hono";
import { ActivityService } from "../services/activity.service";

export class ActivityController {
    constructor(private activityService: ActivityService) { }

    // method to save activity
    async saveActivity(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const body = await c.req.json();
        const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // if (new Date(body.date) > today) {
        //     return c.json({ message: 'Cannot add future activities' }, 400);
        // }else
         if (new Date(body.date) < today){
            return c.json({ message: 'Cannot add past activities' }, 400);
        }
        const activity = await this.activityService.saveActivity(body.date, body.description, userId);
        return c.json(activity, 201);
    }

    // method to get activities
    async getActivities(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const days = parseInt(c.req.query('days') || '20');
        const activities = await this.activityService.getActivities(userId, days);
        return c.json(activities);
    }

    // method to get all activities
    async getAllActivities(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const activities = await this.activityService.getAllActivities(userId);
        return c.json(activities);
    }

    // method to get current streak
    async getStreak(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const streak = await this.activityService.getCurrentStreak(userId);
        return c.json({ streak });
    }

    // method to get longest streak
    async getLongestStreak(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const streak = await this.activityService.getLongestStreak(userId);
        return c.json({ streak });
    }
}