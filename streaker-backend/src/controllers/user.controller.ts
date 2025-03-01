import { Context } from "hono";
import { UserService } from "../services/user.service";

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
}