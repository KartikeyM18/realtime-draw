"use client"

export function AuthPage({isSignin}: {isSignin: boolean}){

    return <div className="h-screen w-screen flex justify-center items-center">
        <div className="bg-white p-2 m-2 rounded text-black flex flex-col gap-1">
            <input type="text" placeholder="Email"  className="border border-gray-400 px-2"/>
            <input type="password" placeholder="Password" className="border border-gray-400 px-2"/>

            <button onClick={()=>{

            }} className="border px-2 rounded">
                {isSignin ? "Sign in" : "Sign up"}
            </button>

        </div>
    </div>
}