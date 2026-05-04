import { motion } from "motion/react";
import { ChevronRight, LayoutDashboard, Compass, Send, Menu, ShieldCheck, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../services/firebase";
import { User } from "firebase/auth";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 font-display">
      <nav className="max-w-7xl mx-auto flex items-center justify-between glass-dark rounded-full px-6 py-3 border-white/10 shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-8 h-8 rounded-lg bg-ambition flex items-center justify-center text-midnight group-hover:rotate-12 transition-transform shadow-lg shadow-ambition/20">
              <span className="font-serif font-black text-xl">A</span>
            </div>
            <span className="font-serif text-2xl font-bold tracking-tighter uppercase italic">Aetos</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
            <a href="#" className="hover:text-ambition transition-colors">Mission</a>
            <a href="#" className="hover:text-ambition transition-colors">Technology</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full text-[9px] font-mono text-white/30 border border-white/5">
            <ShieldCheck className="w-3 h-3 text-cyan-glow" /> 
            <span className="uppercase tracking-tighter">Sovereign Data Active</span>
          </div>
          
          {user ? (
            <div className="flex items-center gap-3">
               <div className="hidden md:block text-right">
                 <p className="text-[10px] font-mono text-white/80 uppercase font-bold leading-none">{user.displayName}</p>
                 <button onClick={logout} className="text-[8px] font-mono text-ambition/60 uppercase hover:text-ambition transition-colors">Log Out</button>
               </div>
               {user.photoURL ? (
                 <img src={user.photoURL} className="w-8 h-8 rounded-full border border-ambition/30" referrerPolicy="no-referrer" />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40"><UserIcon className="w-4 h-4" /></div>
               )}
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-ambition text-midnight hover:scale-105 active:scale-95 transition-all font-mono text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-ambition/10"
            >
              <LogIn className="w-4 h-4" />
              <span>Initiate Archetype</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

// Add this to make it build if onAuthStateChanged is missing from imports
import { onAuthStateChanged } from "firebase/auth";
