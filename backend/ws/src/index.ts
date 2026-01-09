import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import type { AuthPayload } from "./types/authPayload.js";

const port = 4001;
const wss = new WebSocketServer({port: port});


wss.on("connection", (ws, request)=>{
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? "";

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if(!decoded || !decoded.userId){
        ws.close();
        return;
    }

    ws.on("error", console.error);
    
    ws.on("message", (data)=>{
        console.log(data.toString());
        ws.send(data.toString());
    })
    
    ws.send("Connected");
})

console.log(`Started wss at port ${port}`);