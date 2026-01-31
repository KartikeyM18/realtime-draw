"use client"

import Link from "next/link";

export default function Home() {


    return (
        <div className="min-h-screen bg-black flex justify-center items-center">
            <Link href={"/signin"}>
            <button className="border">Sign In</button>
            </Link>
            <Link href={"/signup"}>
            <button className="border">Sign Up</button>
            </Link>
        </div>
    );
}
