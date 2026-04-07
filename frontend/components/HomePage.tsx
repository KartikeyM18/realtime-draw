import Link from "next/link";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      
      <nav className="w-full flex items-center justify-between p-6 max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-2">
          
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight">DrawSync</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/signin" 
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Sign up free
          </Link>
        </div>
      </nav>

      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-24 z-10 w-full max-w-5xl mx-auto">
        
        
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Real-time collaboration enabled
        </div>

        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          The blank canvas for <br className="hidden md:block" />
          your team's best ideas.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Draw, plan, and ideate together in real-time. A blazingly fast, collaborative whiteboard designed for modern teams.
        </p>

        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            Start drawing now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        
        <div className="mt-20 w-full aspect-[16/9] md:aspect-[21/9] glass-panel border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl shadow-black/50 bg-dot-pattern">
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel border border-zinc-700/50 rounded-xl px-4 py-2 flex gap-3 shadow-lg">
            <div className="w-6 h-6 rounded bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center cursor-pointer" />
            <div className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer" />
            <div className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer" />
            <div className="w-px h-6 bg-zinc-700 mx-1" />
            <div className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer" />
          </div>

          
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-indigo-500 rounded-xl transform -rotate-12 opacity-80" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border-2 border-emerald-500 rounded-full opacity-80" />
          
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-4 -translate-y-4 flex flex-col items-start drop-shadow-md">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="#6366f1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-12">
               <polygon points="3 3 21 11 14 14 11 21 3 3"/>
             </svg>
             <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-3 mt-1 shadow-sm">
               Guest
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}