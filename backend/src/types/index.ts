import { PrismaClient } from "@prisma/client";

export interface Env {
    DB : PrismaClient
    JWT_SECRET : string
}

export interface JWTPayload {
    id : number
}