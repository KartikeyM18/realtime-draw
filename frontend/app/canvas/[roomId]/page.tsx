"use client"
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function CanvasRoom(){
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if(canvasRef.current){
            initDraw(canvasRef.current);
        }
    }, [canvasRef]);

    return <div className="border">
        <canvas ref={canvasRef} width={1400} height={800} className="border"></canvas>
    </div>
}