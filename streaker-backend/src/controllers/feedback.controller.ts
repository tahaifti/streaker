import { Context } from "hono";
import { FeedbackService } from "../services/feedback.service";

export class FeedbackController {
    constructor(private feedbackService: FeedbackService) { }

    async submitFeedback(c: Context) {
        try {
            const { type, message, email } = await c.req.json();
            const feedbackData = await this.feedbackService.submitFeedback(type, message, email);
            return c.json({
                success: true,
                data: feedbackData
            }, 201);
        } catch (error) {
            return c.json({
                success: false,
                message: "Failed to submit feedback"
            }, 500);
        }
    }

    async getFeedbacks(c: Context) {
        try {
            const feedbacks = await this.feedbackService.getFeedbacks();
            return c.json({
                success: true,
                data: feedbacks
            });
        } catch (error) {
            return c.json({
                success: false,
                message: "Failed to fetch feedbacks"
            }, 500);
        }
    }
}