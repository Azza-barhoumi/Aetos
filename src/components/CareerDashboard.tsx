import React from "react";
import { motion } from "motion/react";
import { TrendingUp, Award, Clock, ArrowRight, Minus, Radar, Sparkles, Map, ChevronRight } from "lucide-react";
import { CareerMatch, PersonaDimension } from "../types";
import { Radar as RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarArea, ResponsiveContainer, RadarChart as RRadarChart } from 'recharts';

const MOCK_RADAR_DATA = [
  { subject: 'Cognitive', A: 120, fullMark: 150 },
  { subject: 'Work Style', A: 98, fullMark: 150 },
  { subject: 'Interpersonal', A: 86, fullMark: 150 },
  { subject: 'Emotional', A: 99, fullMark: 150 },
  { subject: 'Learning', A: 115, fullMark: 150 },
  { subject: 'Values', A: 110, fullMark: 150 },
];

const MOCK_TRAITS: PersonaDimension[] = [
  { id: 1, name: "Processing Depth", domain: "Cognitive", score: 0.92, certainty: 0.85 },
  { id: 15, name: "Innovation Drive", domain: "Work Style", score: 0.88, certainty: 0.91 },
  { id: 25, name: "Empathic Accuracy", domain: "Interpersonal", score: 0.76, certainty: 0.65 },
  { id: 38, name: "Stress Tolerance", domain: "Emotional", score: 0.82, certainty: 0.78 },
];

const MOCK_MATCHES: CareerMatch[] = [
  {
    id: "1",
    title: "BI Developer",
    zScore: 94.2,
    description: "Highly aligned with your high Innovation Drive and Mental Flexibility. Market demand reflects your technical priors.",
    alignment: {
      traits: ["Abstract Reasoning", "Innovation Drive", "Mental Flexibility"],
      gaps: ["SQL Mastery", "Data Storytelling"]
    },
    marketDemand: "High"
  },
  {
    id: "2",
    title: "AI Product Strategist",
    zScore: 88.7,
    description: "Matches your deep Processing Depth and Leadership Inclination. Opportunity for impact in the MENA region.",
    alignment: {
      traits: ["Processing Depth", "Empathic Accuracy", "Persuasion Orientation"],
      gaps: ["ML Fundamentals", "B2B Sales Cycle"]
    },
    marketDemand: "High"
  }
];

export function CareerRevelation({ data }: { data?: any }) {
  const matches = data?.matches || [];
  const traits = data?.traits || [];
  const archetype = data?.archetype || "Inferred Professional";

  const radarData = traits.length > 0 
    ? traits.map((t: any) => ({ subject: t.name, A: t.score * 150, fullMark: 150 }))
    : MOCK_RADAR_DATA;

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto space-y-16">
      {/* Persona Header */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-ambition" />
            <span className="text-[10px] font-mono text-ambition uppercase tracking-[0.4em] font-black">Pillar I: Workplace Persona</span>
          </div>
          <h2 className="text-6xl font-serif mb-6 uppercase tracking-tighter italic">
            {archetype}
          </h2>
          <p className="text-white/60 mb-8 text-lg font-sans leading-relaxed">
            The Aetos engine has synthesized a <span className="text-white font-bold underline decoration-ambition/30">Precise Mapping</span> of your cognitive style and professional trajectory.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {traits.map((trait: any, i: number) => (
              <div key={i} className="p-4 glass-dark rounded-xl border border-white/5">
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{trait.domain || 'Core'}</div>
                <div className="text-sm font-bold text-white mb-2">{trait.name}</div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trait.score * 100}%` }}
                    className="h-full bg-ambition shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="h-[400px] w-full glass-dark rounded-3xl p-6 border border-ambition/10 relative"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none data-grid-bg" />
          <ResponsiveContainer width="100%" height="100%">
            <RRadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontFamily: 'Space Grotesk' }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <RadarArea
                name="Persona"
                dataKey="A"
                stroke="#D4AF37"
                fill="#D4AF37"
                fillOpacity={0.4}
              />
            </RRadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-ambition/20 to-transparent" />

      {/* Careers Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-5xl font-serif mb-4 uppercase tracking-tighter italic">
                Market <span className="text-ambition text-glow-gold">Synthesis</span>
              </h2>
              <p className="text-white/40 font-mono text-xs uppercase tracking-widest">Ranked by Bayesian Fit Score (Z-Score)</p>
            </div>
            <button className="text-[10px] font-mono text-ambition uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              Explore Knowledge Graph <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {matches.map((match: any, i: number) => (
              <CareerCard key={i} match={match} index={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  function CareerCard({ match, index }: { match: any, index: number, key?: React.Key }) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-dark rounded-[2.5rem] p-10 border border-white/5 hover:border-ambition/40 transition-all group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 py-8 px-10 text-right">
            <div className="text-5xl font-mono text-ambition/20 leading-none group-hover:text-ambition transition-colors">{match.zScore || 0}<span className="text-xl">%</span></div>
            <div className="text-[9px] font-mono text-white/20 uppercase tracking-tighter mt-2">Bayesian Fit Score</div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-glow/5 border border-cyan-glow/20 text-[8px] font-mono text-cyan-glow uppercase">
              <TrendingUp className="w-2.5 h-2.5" /> High Demand
            </div>
        </div>
  
        <div className="relative z-10 mb-8 max-w-[70%]">
          <h3 className="text-3xl font-serif mb-2 group-hover:text-ambition transition-colors">{match.title}</h3>
          <div className="flex items-center gap-3">
             <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">Optimization available via CV Loom</span>
          </div>
        </div>
  
        {/* Why this fits - Neural Explanation */}
        <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10 relative group-hover:bg-white/10 transition-colors">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-midnight border border-white/10 rounded-full text-[8px] font-mono text-white/40 uppercase">Aetos Analysis: Why this fits</div>
            <p className="text-sm text-white/80 font-sans leading-relaxed italic">
                {match.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
                {match.alignment?.traits?.map((t: string) => (
                    <span key={t} className="px-2 py-1 rounded-md bg-ambition/10 text-[9px] font-mono text-ambition uppercase">{t}</span>
                ))}
            </div>
        </div>
  
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h4 className="text-[10px] font-mono text-ambition uppercase tracking-[0.2em] mb-4 font-black">3-Month Glide Path</h4>
            <div className="relative pl-4 border-l border-white/10 space-y-6">
              {match.glidePath?.map((step: string, j: number) => (
                <div key={j} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-ambition border-4 border-midnight shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  <div className="text-[11px] text-white/70 leading-relaxed">
                    <span className="text-white font-bold block mb-1 uppercase text-[9px] tracking-widest text-white/40">Phase {j+1}</span>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <h4 className="text-[10px] font-mono text-cyan-glow uppercase tracking-[0.2em] mb-4 font-black">Strategic Gaps</h4>
            <div className="space-y-3">
              {match.gaps?.map((g: string) => (
                <div key={g} className="p-3 glass-dark rounded-xl border border-white/5 flex items-start gap-3 group/gap cursor-pointer hover:border-cyan-glow/30 transition-all">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-glow mt-1.5 shrink-0" />
                  <span className="text-[11px] text-white/70 italic leading-snug">{g}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 rounded-xl bg-cyan-glow/5 border border-cyan-glow/10 border-dashed">
                <div className="text-[9px] font-mono text-cyan-glow uppercase mb-2">Automated Next Step</div>
                <div className="text-[10px] text-white/40 leading-relaxed">System has identified 4 certification providers for these gaps.</div>
            </div>
          </div>
        </div>

        <button className="w-full py-4 glass-dark rounded-2xl border border-ambition/30 text-ambition font-mono text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-ambition hover:text-midnight transition-all group/loom">
            Loom Optimized CV for {match.title}
            <ArrowRight className="w-4 h-4 group-hover/loom:translate-x-2 transition-transform" />
        </button>
      </motion.div>
    );
  }
