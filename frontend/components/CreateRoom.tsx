"use client"

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";

export function CreateRoom() {
    const [roomName, setRoomName] = useState("");
    const [action, setAction] = useState<"create" | "join">("create");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
        }
    }, [router]);

    async function handleRoomAction(e: FormEvent) {
        e.preventDefault();
        
        if (!roomName.trim()) {
            setError("Please enter a room name");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required");

            if (action === "create") {
                await axios.post(`${HTTP_BACKEND}/room`, {
                    name: roomName
                }, {
                    headers: {
                        Authorization: token
                    },
                });
            }
            
            router.push(`/canvas/${roomName}`);

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to access room. Please try again.");
            setIsLoading(false); 
        }
    }

    function handleLogout() {
        localStorage.removeItem("token");
        router.push("/");
    }

    return (
        <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-dot-pattern relative">
            
            <div className="absolute top-0 w-full p-6 flex justify-between items-center max-w-7xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="font-bold text-white tracking-tight">DrawSync</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                    Log out
                </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl w-full max-w-md mx-4 flex flex-col gap-8 shadow-2xl">
                
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-2 border border-indigo-500/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Your Workspace</h1>
                    <p className="text-zinc-400 text-sm text-center">
                        Create a new canvas or join an existing one to start collaborating.
                    </p>
                </div>

                <div className="flex p-1 bg-[#0a0a0c] rounded-lg border border-zinc-800">
                    <button 
                        onClick={() => { setAction("create"); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${action === "create" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
                    >
                        Create Room
                    </button>
                    <button 
                        onClick={() => { setAction("join"); setError(""); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${action === "join" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}
                    >
                        Join Room
                    </button>
                </div>

                <form onSubmit={handleRoomAction} className="flex flex-col gap-4">
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-300">
                            {action === "create" ? "New Room Name" : "Enter Room Name to Join"}
                        </label>
                        <input 
                            type="text" 
                            placeholder={action === "create" ? "e.g. project-alpha" : "Room Name"} 
                            required
                            className="bg-[#0a0a0c] border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value.toLowerCase().replace(/\s+/g, '-'))} 
                        />
                        {action === "create" && (
                            <span className="text-xs text-zinc-500 mt-1">
                                Room names will be auto-formatted (e.g., spaces replaced with dashes).
                            </span>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            action === "create" ? "Create Workspace" : "Join Workspace"
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}