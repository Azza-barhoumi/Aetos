import React from "react";
import { motion } from "motion/react";
import { Activity, Bell, RefreshCcw, ShieldCheck } from "lucide-react";

export function LivePulse() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-glow/10 border border-cyan-glow/20 rounded-full">
             <Activity className="w-3 h-3 text-cyan-glow" />
             <span className="text-[10px] font-mono text-cyan-glow uppercase tracking-widest">Ongoing Calibration</span>
          </div>
          <h2 className="text-5xl font-serif italic mb-6">Aetos never sleeps. <br />Your Echo works <span className="text-cyan-glow">24/7.</span></h2>
          <p className="text-white/50 text-lg leading-relaxed font-light">
            Career growth isn't a one-time event. Aetos maintains a "Live Pulse" on your professional trajectory, updating your Echo based on new market data and your real-time feedback.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <PulseItem 
                icon={<Bell className="w-5 h-5 text-cyan-glow" />}
                title="Weekly Sync"
                desc="A 2-minute alignment check to keep your Echo synchronized with your current trajectory."
            />
            <PulseItem 
                icon={<RefreshCcw className="w-5 h-5 text-ambition" />}
                title="Dynamic Pivot"
                desc="If a new industry explodes that fits your frequency, Aetos alerts you immediately."
            />
          </div>
        </div>

        <div className="relative">
            <div className="absolute inset-0 bg-cyan-glow/10 blur-[120px] rounded-full" />
            <div className="relative glass-dark rounded-[3rem] p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Active Surveillance</span>
                    <div className="px-2 py-1 bg-green-500/10 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] font-mono text-green-500">SYSTEM SECURE</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <LiveNotification 
                        type="Match" 
                        msg="Senior Bio-Tech Lead role identified. 96% Match." 
                        time="2m ago" 
                    />
                    <LiveNotification 
                        type="Signal" 
                        msg="Market shift detected in Sustainable Energy. Re-calibrating priors." 
                        time="1h ago" 
                    />
                    <LiveNotification 
                        type="Passport" 
                        msg="Anonymized Passport shared with Tier-1 Partner." 
                        time="3h ago" 
                    />
                    <LiveNotification 
                        type="Loom" 
                        msg="CV for 'Chief Operations' ready for review." 
                        time="5h ago" 
                    />
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-midnight" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-ambition/20 border border-midnight flex items-center justify-center text-[10px] text-ambition font-bold">+12</div>
                    </div>
                    <span className="text-[9px] font-mono text-white/20 uppercase">Network Density: 0.84</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

function PulseItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                {icon}
            </div>
            <h4 className="font-serif italic text-white uppercase tracking-tight">{title}</h4>
            <p className="text-[11px] text-white/30 leading-relaxed">{desc}</p>
        </div>
    );
}

function LiveNotification({ type, msg, time }: { type: string, msg: string, time: string }) {
    return (
        <div className="p-4 glass-dark rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-white/20 transition-all">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                type === 'Match' ? 'bg-ambition/20 text-ambition' : 
                type === 'Signal' ? 'bg-cyan-glow/20 text-cyan-glow' : 
                'bg-white/10 text-white/40'
            }`}>
               {type[0]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/70 truncate">{msg}</p>
                <p className="text-[9px] text-white/20 uppercase font-mono">{time}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
        </div>
    );
}

import { ChevronRight } from "lucide-react";
