"use client"

import { HTTP_BACKEND, WS_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    async function authenticate(e: FormEvent) {
        e.preventDefault(); 
        
        setIsLoading(true);
        setError("");

        try {
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
            });

            const token = res.data.token;
            localStorage.setItem("token", token);
            router.push("/room");
            
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-screen flex justify-center items-center bg-dot-pattern">
            <div className="glass-panel p-8 rounded-2xl w-full max-w-md mx-4 flex flex-col gap-6">
                
                <div className="flex flex-col items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        {isSignin ? "Welcome back" : "Create an account"}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {isSignin ? "Sign in to access your workspace" : "Join to start collaborating"}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={authenticate} className="flex flex-col gap-4">
                    {!isSignin && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-zinc-300">Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                required={!isSignin}
                                className="bg-[#0a0a0c] border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-300">Username</label>
                        <input 
                            type="text" 
                            placeholder="johndoe123" 
                            required
                            className="bg-[#0a0a0c] border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-300">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required
                            className="bg-[#0a0a0c] border border-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center h-12"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            isSignin ? "Sign in" : "Sign up"
                        )}
                    </button>
                </form>

                <div className="text-center text-sm text-zinc-400 mt-2">
                    {isSignin ? "Don't have an account? " : "Already have an account? "}
                    <Link 
                        href={isSignin ? "/signup" : "/signin"} 
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                    >
                        {isSignin ? "Sign up" : "Sign in"}
                    </Link>
                </div>
                
            </div>
        </div>
    );
}