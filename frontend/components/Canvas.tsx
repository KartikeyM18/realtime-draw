"use client"

import { initDraw, Tool } from "@/draw";
import { useEffect, useRef, useState } from "react";

const COLORS = [
    { value: "#ffffff", label: "White" },
    { value: "#ef4444", label: "Red" },
    { value: "#10b981", label: "Green" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#eab308", label: "Yellow" },
];

export function Canvas({ roomId, socket, roomName }: { roomId: string, socket: WebSocket, roomName?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
    const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
    
    const selectedToolRef = useRef<Tool>(selectedTool);
    const selectedColorRef = useRef<string>(selectedColor);
    
    const clearCanvasRef = useRef<() => void>(() => {});

    useEffect(() => {
        selectedToolRef.current = selectedTool;
    }, [selectedTool]);

    useEffect(() => {
        selectedColorRef.current = selectedColor;
    }, [selectedColor]);

    useEffect(() => {
        let cleanupFunc: () => void;

        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket, selectedToolRef, selectedColorRef)
                .then(({ cleanup, triggerClear }) => {
                    cleanupFunc = cleanup;
                    clearCanvasRef.current = triggerClear;
                });
        }

        return () => {
            if (cleanupFunc) cleanupFunc();
        }
    }, [roomId, socket]);

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0a0a0c] bg-dot-pattern relative flex justify-center">
            
            <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-lg flex items-center gap-3 z-10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-white">{roomName || "Workspace"}</span>
            </div>

            <div className="absolute top-4 glass-panel px-3 py-2 rounded-xl flex items-center gap-2 z-10 shadow-2xl border border-zinc-800">
                <ToolButton active={selectedTool === "pointer"} onClick={() => setSelectedTool("pointer")} icon={<path d="M5 12h14M12 5l7 7-7 7" />} label="Pointer" />
                <ToolButton active={selectedTool === "pencil"} onClick={() => setSelectedTool("pencil")} icon={<path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586" />} label="Pencil" />
                
                <div className="w-px h-6 bg-zinc-700 mx-1" />
                
                <ToolButton active={selectedTool === "rect"} onClick={() => setSelectedTool("rect")} icon={<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>} label="Rectangle" />
                <ToolButton active={selectedTool === "circle"} onClick={() => setSelectedTool("circle")} icon={<circle cx="12" cy="12" r="10"/>} label="Circle" />
                <ToolButton active={selectedTool === "line"} onClick={() => setSelectedTool("line")} icon={<line x1="5" y1="19" x2="19" y2="5" />} label="Line" />
                
                <div className="w-px h-6 bg-zinc-700 mx-1" />

                <div className="flex gap-1 items-center px-1">
                    {COLORS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`w-5 h-5 rounded-full border-2 transition-all ${selectedColor === color.value ? "border-indigo-500 scale-125" : "border-transparent hover:scale-110"}`}
                            style={{ backgroundColor: color.value }}
                        />
                    ))}
                </div>

                <div className="w-px h-6 bg-zinc-700 mx-1" />

                <button 
                    onClick={() => clearCanvasRef.current()}
                    className="text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Clear All
                </button>
            </div>

            <canvas 
                ref={canvasRef} 
                className={`block w-full h-full ${selectedTool === 'pointer' ? 'cursor-default' : 'cursor-crosshair'}`}
            />
        </div>
    );
}

function ToolButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button 
            onClick={onClick}
            title={label}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                active 
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/50" 
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent"
            }`}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {icon}
            </svg>
        </button>
    );
}