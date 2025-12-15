import { Request, Response } from "express";
import ResponseWriter from "../../class/response_writer";

export default async function makeTradeController(req: Request, res: Response) {
    try {
        const user = req.user;
        if (!user || !user.id) {
            ResponseWriter.unauthorized(res);
            return;
        }

        
    } catch (error) {
        
    }
}