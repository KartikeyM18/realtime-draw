import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import type { AuthPayload } from "../types/authPayload.js";

export function verifyJwt(req: Request, res: Response, next: NextFunction){

    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if(decoded){
        req.userId = decoded.userId;
        next();
    }
    else{
        res.status(403).json({msg: "Unauthorised"});
    }
}