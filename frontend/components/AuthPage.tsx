"use client"

import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const router = useRouter();

    async function authenticate() {
        if (!isSignin) {
            await axios.post(`${HTTP_BACKEND}/signup`, {
                username,
                password,
                name
            });
        }

        const res = await axios.post(`${HTTP_BACKEND}/signin`, {
            username,
            password
        })

        const token = res.data.token;
        localStorage.setItem("token", token);

        router.push("/");

    }


    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="bg-white p-2 m-2 rounded text-black flex flex-col gap-1">
            {!isSignin &&
                <input type="text" placeholder="Name" className="border border-gray-400 px-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            }

            <input type="text" placeholder="Email" className="border border-gray-400 px-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />

            <input type="password" placeholder="Password" className="border border-gray-400 px-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />


            <button onClick={authenticate} className="border px-2 rounded">
                {isSignin ? "Sign in" : "Sign up"}
            </button>

        </div>
    </div>
}