import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";
import * as bcrypt from 'bcryptjs';

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

    async updateUserProfile(id : string, name : string, username : string, email : string){
        try {
            const user = await this.db.user.update({
                where : {
                    id
                },
                data : {
                    name,
                    username,
                    email
                }
            });
            return user;
        } catch (error: any) {
            return new HTTPException(500, { message: `Failed to update user profile: ${error.message}` });
        }
    }

    async changePassword(id: string, oldPassword: string, newPassword: string) {
        try {
            // Find the user by ID
            const user = await this.db.user.findUnique({
                where: {
                    id
                }
            });

            if (!user) {
                throw new HTTPException(404, { message: 'User not found' });
            }

            // Compare the old password with the stored hashed password
            const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

            if (!isOldPasswordValid) {
                throw new HTTPException(400, { message: 'Old password is incorrect' });
            }

            // Hash the new password
            const newHashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            const updatedUser = await this.db.user.update({
                where: {
                    id
                },
                data: {
                    password: newHashedPassword
                }
            });

            return updatedUser;
        } catch (error: any) {
            // Handle any errors that occur during the process
            throw new HTTPException(500, { message: `Failed to change password: ${error.message}` });
        }
    }
}