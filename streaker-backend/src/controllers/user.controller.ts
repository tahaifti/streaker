import { Context } from "hono";
import { UserService } from "../services/user.service";
import { updateUserSchema } from "@ifti_taha/streaker-common";

export class UserController {
    constructor (private userService: UserService) { }

    // method to get user profile
    async getUserProfile(c : Context){
        const {id : userId} = c.get('jwtPayload');
        const user = await this.userService.getUserProfile(userId);
        return c.json(user);
    }

    // method to get any user by username
    async getUserByUsername(c: Context) {
        const username = c.req.param('username');
        const user = await this.userService.getUserByUsername(username);
        return c.json(user);
    }

    //  method to get user by id
    async getUserById(c: Context) {
        const id = c.req.param('id');
        const user = await this.userService.getUserById(id);
        return c.json(user);
    }

    // method to get all users
    async getAllUsers(c: Context) {
        const users = await this.userService.getAllUsers();
        return c.json(users);
    }

    async updateUserProfile(c: Context) {
        const {id : userId} = c.get('jwtPayload');
        const body = await c.req.json();
        const { success } = updateUserSchema.safeParse(body);
        if (!success) {
            c.status(400);
            return c.json({ message: 'Invalid request body' });
        }
        const { name, username, email } = body;
        const user = await this.userService.updateUserProfile(userId, name, username, email);
        return c.json(user);
    }

    async changePassword(c : Context){
        const {id : userId} = c.get('jwtPayload');
        const {oldPassword, newPassword} = await c.req.json();
        const user = await this.userService.changePassword(userId, oldPassword, newPassword);
        return c.json(user);
    }
}