import React from "react";
import { motion } from "motion/react";
import { Sparkles, Trophy, Target, Shield, Cpu } from "lucide-react";

export function Hero({ onUpload }: { onUpload?: () => void }) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
      <div className="absolute inset-0 data-grid-bg opacity-20 pointer-events-none" />
      <div className="absolute inset-0 mythic-gradient opacity-60 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ambition/30 bg-ambition/5 mb-10 overflow-hidden group">
          <motion.div 
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Sparkles className="w-4 h-4 text-ambition" />
          </motion.div>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ambition font-black">Aetos Calibration Protocol</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-[0.9] tracking-tighter">
          Your CV is <br />
          <span className="italic text-ambition text-glow-gold">Only a Silhouette.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 font-sans max-w-3xl mx-auto mb-14 leading-relaxed font-light">
          Aetos deciphers the <span className="text-white font-medium italic underline decoration-ambition/30">unseen trajectory</span> of your professional voice. We don't map your past; we calibrate your echo for the future you were built to lead.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative w-full sm:w-auto px-12 py-6 bg-ambition text-midnight font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[.2em] cursor-pointer shadow-[0_20px_50px_rgba(212,175,55,0.2)]">
            Begin Calibration
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          </button>
          
          <div className="flex items-center gap-4">
             <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest hidden sm:block">OR</span>
             <button 
               onClick={onUpload}
               className="group flex items-center gap-3 px-8 py-5 glass-dark text-white font-bold rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-[10px] uppercase tracking-widest border border-white/5"
             >
               <Cpu className="w-5 h-5 text-ambition" />
               Upload CV for Fast-Track
             </button>
          </div>
        </div>
      </motion.div>

      {/* Narrative Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-32 grid md:grid-cols-3 gap-12 max-w-6xl w-full px-6 border-t border-white/5 pt-20"
      >
        <NarrativeBlock 
          icon={<Shield className="text-cyan-glow" />}
          title="Sovereign identity"
          desc="Your data is your vault. Aetos generates anonymized 'Echo Passports'—allowing you to haunt the job market without exposing your true coordinates until the signal is right."
        />
        <NarrativeBlock 
          icon={<Target className="text-ambition" />}
          title="Hidden Trajectory"
          desc="Standard searches look for roles. Aetos deciphers the systemic gaps in the world where your specific cognitive frequency is the only missing piece."
        />
        <NarrativeBlock 
          icon={<Trophy className="text-white" />}
          title="The Convergence"
          desc="Built for the disengaged. Aetos stops the search and starts the alignment, connecting your story to the high-impact work you were calibrated to lead."
        />
      </motion.div>
    </section>
  );
}

function NarrativeBlock({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-ambition/50 transition-colors">
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <h3 className="text-xl font-serif italic text-white uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed font-sans">{desc}</p>
    </div>
  );
}
