import { AuthService } from "../services/auth.service"
import { Context } from "hono"
import { sign } from "hono/jwt";
import { createUserSchema, loginSchema } from "@ifti_taha/streaker-common";

export class AuthController{
    constructor(private authService : AuthService) {}

    async registerUser(c : Context) {
        const body = await c.req.json();
        const { success } = createUserSchema.safeParse(body);
        if(!success) {
            return c.json({message: 'Invalid input'}, 400)
        }
        const user = await this.authService.registerUser(body.name, body.username, body.email, body.password);
        return c.json(user, 201);
    }

    async loginUser(c : Context){
        const body = await c.req.json();

        const { success } = loginSchema.safeParse(body);
        console.log(success);
        if(!success) {
            return c.json({message: 'Invalid input'}, 400)
        }
        if(!body.isOAuthLogin && !body.password){
            return c.json({message: 'Password is required'}, 400);
        }
        const user = await this.authService.verifyUser(body.email, body.password, body.isOAuthLogin ?? false);
        const token = await sign({id : user.id}, c.env.JWT_SECRET)
        return c.json({user, token});
    }
}
