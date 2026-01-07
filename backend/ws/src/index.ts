import { WebSocketServer } from "ws";

const port = 4001;
const wss = new WebSocketServer({port: port});


wss.on("connection", (ws)=>{
    ws.on("error", console.error);
    
    ws.on("message", (data)=>{
        console.log(data.toString());
        ws.send(data.toString());
    })
    
    ws.send("Connected");
})

console.log(`Started wss at port ${port}`);