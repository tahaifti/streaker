import { PrismaClient } from "@prisma/client"
import { AuthService } from "../services/auth.service"
import { Context } from "hono"
import { sign } from "hono/jwt";

export class AuthController{
    constructor(private authService : AuthService) {}

    async registerUser(c : Context) {
        const body = await c.req.json();
        if(!body.email || !body.password) {
            return c.json({message: 'Email and password are required'}, 400)
        }
        const user = await this.authService.registerUser(body.name, body.username, body.email, body.password);
        return c.json(user, 201);
    }

    async loginUser(c : Context){
        const body = await c.req.json();
        if(!body.email || !body.password) {
            return c.json({message: 'Email and password are required'}, 400)
        }
        const user = await this.authService.verifyUser(body.email, body.password);
        const token = await sign({id : user.id}, c.env.JWT_SECRET)
        return c.json({user, token});
    }
}
