import { PrismaClient } from "@prisma/client/edge";

export class FeedbackService {
    constructor(private db: PrismaClient | any) { }

    async submitFeedback(type : string, message: string, email: string = "") {
        if (!message) {
            throw new Error('Message is required');
        }

        try {
            const feedbackData = await this.db.feedback.create({
                data: {
                    type,
                    message,
                    email
                }
            });
            return feedbackData;
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            throw new Error(error.message || 'Failed to submit feedback');
        }
    }

    async getFeedbacks() {
        try {
            const feedbacks = await this.db.feedback.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return feedbacks;
        } catch (error: any) {
            console.error('Error fetching feedbacks:', error);
            throw new Error(error.message || 'Failed to fetch feedbacks');
        }
    }
}