import { Hono } from "hono";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from '../services/auth.service';
import { PrismaClient } from "@prisma/client";

export const authRouter = new Hono();

const prisma = new PrismaClient();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);


authRouter.post('/register', (c) =>  authController.registerUser(c));
authRouter.post('/login', (c) =>  authController.loginUser(c));