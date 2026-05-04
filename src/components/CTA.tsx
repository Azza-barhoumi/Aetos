import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Bird, Sparkles } from "lucide-react";
import { signInWithGoogle } from "../services/firebase";

export function CTA({ onStart, user }: { onStart: () => void, user: any }) {
  return (
    <section className="py-40 px-6">
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute inset-0 bg-ambition/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative glass-dark rounded-[4rem] p-12 md:p-24 border border-white/10 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ambition/40 to-transparent" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-ambition mx-auto flex items-center justify-center text-midnight shadow-2xl shadow-ambition/30">
              <Bird className="w-10 h-10" />
            </div>
            
            <h2 className="text-4xl md:text-7xl font-serif italic tracking-tighter leading-[0.9]">
              Your professional <br />
              <span className="text-ambition">evolution</span> starts here.
            </h2>
            
            <p className="text-white/40 max-w-xl mx-auto text-lg font-light leading-relaxed">
              Join the thousands of ambassadors who have recalibrated their professional DNA with Aetos. Secure your trajectory today.
            </p>
            
            <div className="pt-8">
              {!user ? (
                <button 
                  onClick={signInWithGoogle}
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-ambition text-midnight font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[.2em] shadow-2xl shadow-ambition/20"
                >
                  Create Account via Google
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={onStart}
                  className="group relative inline-flex items-center gap-4 px-12 py-6 bg-ambition text-midnight font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-[.2em] shadow-2xl shadow-ambition/20"
                >
                  Enter the Chamber
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-12 text-white/20">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Web3 Auth Ready</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">SOC-2 Compliant</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
