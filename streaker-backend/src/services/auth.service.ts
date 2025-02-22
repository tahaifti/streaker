import { PrismaClient } from "@prisma/client/edge";
import { HTTPException } from "hono/http-exception";
import * as bcrypt from 'bcryptjs';

export class AuthService {
    constructor(private db: PrismaClient | any) { }

    async registerUser(name: string,
        username: string,
        email: string,
        password: string,
    ) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await this.db.user.create({
                data: {
                    name,
                    username,
                    email,
                    password: hashedPassword
                },
                select: {
                    id: true,
                    username: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            return user;
        } catch (e: any) {
            if (e.code == 'P2002') {
                throw new HTTPException(409, { message: 'Username or email already exists' });
            }
            throw e;
        }
    }

    async verifyUser(email: string, password: string) {
        const user = await this.db.user.findUnique({
            where: { email },
        })

        if (!user) {
            throw new HTTPException(404, { message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new HTTPException(401, { message: 'Invalid password' });
        }
        return user;
    }
}