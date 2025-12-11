import { Request, Response } from "express";
import prisma from "@repo/database";
import ResponseWriter from "../../class/response_writer";
import jwt from "jsonwebtoken";
import { env } from "../../configs/env.config";

export default async function signInController(req: Request, res: Response) {
    try {
        const { user, account } = req.body;

        if (!user?.email || !account?.provider) {
            return ResponseWriter.not_found(res, "insufficient creds");
        }

        const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                image: user.image,
            },
            create: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: account.provider,
            },
        });

        const token = jwt.sign(
            {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
            },
            env.SERVER_JWT_SECRET,
            { expiresIn: "30d" }
        );

        return ResponseWriter.success(res, { ...dbUser, token }, "Sign in succeeded");
        
    } catch (error) {
        console.error("failed to sign in", error);
        return ResponseWriter.server_error(
            res,
            "Internal server error",
            error instanceof Error ? error.message : undefined
        );
    }
}
