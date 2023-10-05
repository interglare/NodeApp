import jwt from 'jsonwebtoken';
import { invalidatedTokens } from '../config/jwtBlacklist.config';
import { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from "jsonwebtoken";
import { redisClient } from './../config/redisClient';

export type CustomRequest = Request & {
    id: string | JwtPayload;
}

async function verifyToken(req: Request, res: Response, next: NextFunction){
    const authHeader = req.header("authorization");
    if (!authHeader || authHeader.length < 1) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    try {
        const decoded = jwt.verify(token, "accessSecret") as JwtPayload;
        (req as CustomRequest).id = decoded.id;
        const redisResult = await redisClient.get(decoded.id);        
        if (redisResult) { // if (invalidatedTokens.has(token)) {
            return res.status(403).send({message: "Token was disabled"});
        }
        next();
    } catch (error) {       
        return res.status(401).send({
            message: "Unauthorized!",
        });
    }

};

const authJwt = {
    verifyToken: verifyToken,
};

export { authJwt };
