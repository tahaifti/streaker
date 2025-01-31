import { Context } from "hono";
import { ActivityService } from "../services/activity.service";

export class ActivityController {
    constructor(private activityService: ActivityService) { }

    async saveActivity(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const body = await c.req.json();
        const activity = await this.activityService.saveActivity(body.date, body.description, userId, body.completed);
        return c.json(activity, 201);
    }
    async getActivities(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const days = parseInt(c.req.query('days') || '20');
        const activities = await this.activityService.getActivities(userId, days);
        return c.json(activities);
    }

    async getStreak(c: Context) {
        const { id: userId } = c.get('jwtPayload');
        const streak = await this.activityService.getCurrentStreak(userId);
        return c.json({ streak });
    }
}