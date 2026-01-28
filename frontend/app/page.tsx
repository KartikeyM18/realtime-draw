"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <input type="text" className="border" value={roomName} onChange={(e)=>setRoomName(e.target.value)} placeholder="Room name"/>
            <button onClick={()=>router.push(`/room/${roomName}`)} className="border px-2">
                Join
            </button>
        </div>
    );
}
