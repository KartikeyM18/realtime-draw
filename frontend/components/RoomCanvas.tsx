"use client"

import { HTTP_BACKEND, WS_BACKEND } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import axios from "axios";

export function RoomCanvas({ room }: { room: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let ws: WebSocket;

        async function initRoom() {
            try {
                const res = await axios.get(`${HTTP_BACKEND}/room/${room}`);
                const id = res.data.room.id;
                setRoomId(id);

                const token = localStorage.getItem("token");
                if (!token) return;

                ws = new WebSocket(`${WS_BACKEND}?token=${token}`);
                
                ws.onopen = () => {
                    setSocket(ws);
                    ws.send(JSON.stringify({
                        type: "join-room",
                        roomId: id
                    }));
                };

                // ws.onclose = () => {
                //     console.log("WS CLOSED");
                // };


                ws.onerror = () => {
                    setError("Failed to connect to the drawing server.");
                }
            } catch (e) {
                console.error(e);
                setError("Room not found or server error.");
            }
        }

        initRoom();

        return () => {
            if (ws) ws.close();
        }
    }, [room]);

    if (error) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0c] text-white">
                <div className="glass-panel p-6 rounded-xl border border-red-500/30 text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (!socket || !roomId) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0c] bg-dot-pattern">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium">Connecting to workspace...</p>
            </div>
        );
    }

    return <Canvas roomId={roomId} socket={socket} roomName={room} />
}