import React from "react";
import { motion } from "motion/react";
import { Zap, Shield, Cpu, Target, Layers, Sparkles } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-cyan-glow" />,
      title: "Semantic Vectoring",
      desc: "We don't just read your CV; we vector your experiences into a 768-dimension cognitive space to find hidden patterns."
    },
    {
      icon: <Shield className="w-6 h-6 text-ambition" />,
      title: "Sovereign Privacy",
      desc: "Your identity remains encrypted until you decide to reveal your true coordinates to a matched strategic partner."
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Echo Persistence",
      desc: "Your Echo works 24/7, traversing global market fluctuations to identify opportunities you didn't even know existed."
    }
  ];

  return (
    <section className="py-32 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <span className="text-[10px] font-mono text-ambition uppercase tracking-[0.4em] font-black">Core Capabilities</span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4 italic">The Intelligence layer.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] glass-dark border border-white/5 hover:border-ambition/30 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-2xl font-serif italic mb-4 tracking-tight">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed font-sans">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
