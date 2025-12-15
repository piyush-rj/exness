import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import ResponseWriter from "../class/response_writer";
import { env } from "../configs/env.config";
import { AuthUser } from "../types/express";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;
        if (!header) {
            ResponseWriter.not_found(res, 'token not foudn');
            return;
        }

        const token = header.split(' ')[1];
        const secret = env.SERVER_JWT_SECRET;

        if (!token || !secret) {
            ResponseWriter.not_found(res, 'token or secret not found');
            return;
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                ResponseWriter.validation_error(res, err.message);
                return;
            }
            req.user = decoded as AuthUser;
            next();
        })
    } catch (error) {
        console.error('auth middleware failed', error);
        ResponseWriter.server_error(res, 
            'Internal server error',
            error instanceof Error ? error.message : undefined,
        );
        return;
    }

}