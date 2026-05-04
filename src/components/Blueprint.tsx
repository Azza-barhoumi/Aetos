import { motion } from "motion/react";
import { Search, Share2, Layers, Zap, Heart, Braces } from "lucide-react";

export function Blueprint() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">The Aetos Architecture</h2>
        <p className="text-white/40 max-w-2xl mx-auto font-sans font-light">
          Cognitive alignment meets systemic precision.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-[2rem] bg-cyan-glow/5 border border-cyan-glow/20 flex items-center justify-center">
             <Layers className="w-8 h-8 text-cyan-glow" />
          </div>
          <h3 className="text-2xl font-serif italic uppercase tracking-tighter">1. The Echo</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Standard metrics look for skills. Aetos searches for the "Echo"—the subtle decisions, leadership nuances, and cognitive patterns buried in your history.
          </p>
          <ul className="space-y-2 text-[10px] font-mono text-cyan-glow/60 uppercase">
             <li>• Professional Resonance</li>
             <li>• Cognitive Signature</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-[2rem] bg-ambition/5 border border-ambition/20 flex items-center justify-center">
             <Zap className="w-8 h-8 text-ambition" />
          </div>
          <h3 className="text-2xl font-serif italic uppercase tracking-tighter">2. The Convergence</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Your Echo is released into a global simulation of markets. It finds the "Convergence"—the rare alignment where the world's highest needs meet your unique frequency.
          </p>
          <ul className="space-y-2 text-[10px] font-mono text-ambition/60 uppercase">
             <li>• Semantic Alignment</li>
             <li>• Archetype Synergy</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/20 flex items-center justify-center">
             <Share2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-serif italic uppercase tracking-tighter">3. Passive Agency</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Aetos operates on a different clock. It acts behind the scenes, alerting you only when a trajectory appears that fundamentally shifts your professional orbit.
          </p>
          <ul className="space-y-2 text-[10px] font-mono text-white/40 uppercase">
             <li>• Orbit Shifts</li>
             <li>• Stealth Networking</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
