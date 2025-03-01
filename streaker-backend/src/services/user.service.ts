import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";

export class UserService {
    constructor (private db : PrismaClient | any) {}

    async getUserProfile(id : string){
        try {
            const user = await this.db.user.findUnique({
                where : {
                    id
                },
                select : {
                    name : true,
                    email : true,
                    password: true,
                    username : true,
                    current_streak : true,
                    longest_streak : true,
                    createdAt: true
                }
            });
            return user;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get user profile: ${error.message}` });
        }
    }

    async getUserByUsername(username : string){
        try {
            const user = await this.db.find({
                where : {
                    username
                },
                select : {
                    id : true,
                    username : true,
                    current_streak : true,
                    longest_streak : true
                }
            })
            return user;
        } catch (error: any) {
            throw new HTTPException(500, { message: `Failed to get user by username: ${error.message}` });
            
        }
    }

    async getUserById(id : string){
        try {
            const user  = await this.db.findUnique({
                where : {
                    id
                },
                select : {
                    id : true,
                    username : true,
                    current_streak : true,
                    longest_streak : true
                }
            });
            return user;
        } catch (error: any) {
            return new HTTPException(500, { message: `Failed to get user by id: ${error.message}` });
        }
    }

    async getAllUsers(){
        try {
            const users = await this.db.findMany({
                select : {
                    id : true,
                    username : true,
                    current_streak : true,
                    longest_streak : true
                }
            });
            return users;
        } catch (error: any) {
            return new HTTPException(500, { message: `Failed to get all users: ${error.message}` });
        }
    }
}