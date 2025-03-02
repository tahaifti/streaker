import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string
        JWT_SECRET: string
    }
}>();

userRouter.use('/*', authMiddleware);

// GET api/users/profile - Get user profile
userRouter.get('/profile', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.getUserProfile(c)
})

// GET api/users/:username - Get a user by username
userRouter.get('/:username', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.getUserByUsername(c)
})

// GET api/users/:id - Get a user by id
userRouter.get('/:id', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.getUserById(c)
});

// GET api/users - Get all users
userRouter.get('/', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.getAllUsers(c)
})

// POST api/users/update - Update user profile
userRouter.post('/update', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.updateUserProfile(c);
})

// POST api/users/change-password - Change user password
userRouter.post('/change-password', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const userService = new UserService(prisma);
    const userController = new UserController(userService);
    return userController.changePassword(c);
})