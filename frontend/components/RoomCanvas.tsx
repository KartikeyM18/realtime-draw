"use client"

import { HTTP_BACKEND, WS_BACKEND } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";
import axios from "axios";

export function RoomCanvas({ room }: { room: string }) {


    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        async function main() {
            const res = await axios.get(`${HTTP_BACKEND}/room/${room}`);
            const id = res.data.room.id;
            setRoomId(id);

            const token = localStorage.getItem("token");

            if(!token) return;

            const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);


            ws.onopen = () => {
                setSocket(ws);
                ws.send(JSON.stringify({
                    type: "join-room",
                    roomId: id
                }))
            }
        }

        main();
    }, [])




    if (!socket || !roomId) return <div>Connecting to the server ...</div>

    return <Canvas roomId={roomId} socket={socket} />

}