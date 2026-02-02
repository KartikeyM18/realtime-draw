"use client"

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({roomId, socket}: {roomId: string, socket: WebSocket}) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket);
        }
    }, [canvasRef]);

    return <div className="h-screen">
        <canvas ref={canvasRef} width={1400} height={800} className="border"></canvas>
        <div className="absolute bottom-1 right-1 flex flex-col">
            <button className="border p-1">Rectangle</button>
            <button className="border p-1">Circle</button>
        </div>
    </div>
}