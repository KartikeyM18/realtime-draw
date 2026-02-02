import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import type { AuthPayload } from "./types/authPayload.js";
import { prisma } from "@backend/db";

const port = 4001;
const wss = new WebSocketServer({port: port});

interface User{
    userId: string;
    rooms: string[];
    ws: WebSocket; 
}

const users: User[] = [];

function getDecoded(token: string){
    
    try{

        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        
        if(!decoded || !decoded.userId) return null;
        
        return decoded.userId;

    } catch(e){
        return null;
    }
}

wss.on("connection", (ws, request)=>{
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') ?? "";

    const userId = getDecoded(token);

    if(!userId){
        ws.close();
        return;
    }
    
    users.push({
        userId: userId,
        ws: ws,
        rooms: [],
    })

    ws.on("error", console.error);
    
    ws.on("message", async (data)=>{
        const parsedData = JSON.parse(data.toString());
        // {type, roomId, message}

        if(parsedData.type === "join-room"){
            const user = users.find((ele) => ele.ws === ws);
            if(!user) return;
            user.rooms.push(parsedData.roomId);
        }

        if(parsedData.type === "leave-room"){
            const user = users.find((ele) => ele.ws === ws);
            if(!user) return;
            user.rooms = user?.rooms.filter((ele)=>ele != parsedData.roomId);
        }

        console.log(parsedData);

        if(parsedData.type === "chat"){

            await prisma.chat.create({
                data: {
                    message: parsedData.message,
                    userId: userId,
                    roomId: parsedData.roomId
                }
            })
            
            users.forEach((ele)=>{
                if(ele.rooms.includes(parsedData.roomId)){
                    ele.ws.send(JSON.stringify({
                        type: "chat",
                        roomId: parsedData.roomId,
                        message: parsedData.message
                    }))
                }
            })
        }
    })
    
})

console.log(`Started wss at port ${port}`);