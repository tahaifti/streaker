import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { FeedbackService } from "../services/feedback.service";
import { FeedbackController } from "../controllers/feedback.controller";

export const feedbackRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>();

feedbackRouter.post('/submit', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    const feedbackService = new FeedbackService(prisma);
    const feedbackController = new FeedbackController(feedbackService);
    return feedbackController.submitFeedback(c)
});

feedbackRouter.get('/get', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    const feedbackService = new FeedbackService(prisma);
    const feedbackController = new FeedbackController(feedbackService);
    return feedbackController.getFeedbacks(c);
}
);