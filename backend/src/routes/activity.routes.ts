import { Hono } from "hono";
import { ActivityController } from "../controllers/activity.controller";
import { ActivityService } from "../services/activity.service";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";

export const activityRouter = new Hono();

const prisma = new PrismaClient();
const activityService = new ActivityService(prisma);
const activityController = new ActivityController(activityService);

activityRouter.use('/*', authMiddleware);

activityRouter.get('/activities', (c) => activityController.getActivities(c));

activityRouter.post('/activities', (c) => activityController.saveActivity(c));

activityRouter.get('/streak', (c) => activityController.getStreak(c));