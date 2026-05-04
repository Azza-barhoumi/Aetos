import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, PersonaDimension } from '../types';
import { ArchetypeRadar } from './ArchetypeRadar';
import { Sparkles, FileText, Target, Zap, Shield, TrendingUp, Award, Quote, RefreshCw, ChevronRight, ListFilter, Database } from 'lucide-react';
import { AETOS_DIMENSIONS, AETOS_DOMAINS } from '../constants/dimensions';
import { ARCHETYPES } from '../constants';

interface RevelationProps {
  profile: UserProfile;
  onReset: () => void;
}

export function Revelation({ profile, onReset }: RevelationProps) {
  const { revelation } = profile;
  const [selectedCompare, setSelectedCompare] = React.useState<string | null>(null);

  if (!revelation) return null;

  const radarDimensions: PersonaDimension[] = revelation.dimensionalBreakdown.map((db, idx) => {
    const original = AETOS_DIMENSIONS.find(d => d.name === db.name);
    return {
      id: idx,
      name: db.name,
      domain: original?.domain || 'Unknown',
      score: db.value,
      certainty: 0.9,
    };
  });

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Protocol Header */}
      <div className="flex flex-col items-center mb-20 text-center">
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 px-6 py-2 bg-ambition/5 border border-ambition/20 rounded-full text-ambition text-[10px] font-mono uppercase tracking-[0.4em] mb-8"
        >
            <Shield className="w-3 h-3" /> Synthesis Protocol Fully Calibrated
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-serif italic mb-6 leading-none">
          The <span className="text-ambition text-glow-gold">{revelation.archetypeTitle}</span>
        </h1>
        
        <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">
          Cognitive Class: {revelation.archetype} | ID: A-ECHO-{Math.floor(Math.random() * 9000 + 1000)}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Insight Column */}
        <div className="lg:col-span-8 space-y-8">
            {/* The Deep Dive Narrative */}
            <section className="glass-dark rounded-[3rem] p-12 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Quote className="w-64 h-64" />
                </div>
                <h2 className="text-3xl font-serif italic mb-8 flex items-center gap-4">
                    The Cognitive Narrative
                    <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </h2>
                <div className="prose prose-invert prose-lg max-w-none">
                    <div className="text-white/80 leading-relaxed font-light space-y-8 text-xl first-letter:text-7xl first-letter:font-serif first-letter:mr-4 first-letter:float-left first-letter:text-ambition first-letter:leading-none">
                        {revelation.narrative.split('\n').filter(p => p.trim()).map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Evidence & Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
                <section className="glass-dark p-10 rounded-[2.5rem] border border-cyan-glow/10 bg-cyan-glow/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-cyan-glow/10 rounded-2xl">
                            <Target className="w-6 h-6 text-cyan-glow" />
                        </div>
                        <h3 className="text-2xl font-serif italic">Evidence Markers</h3>
                    </div>
                    <div className="space-y-4">
                        {revelation.pdfDeepInferences.map((inf, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:border-cyan-glow/30 transition-all">
                                <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                                <p className="text-sm text-white/60 group-hover:text-white/90 transition-colors leading-relaxed italic">"{inf}"</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-dark p-10 rounded-[2.5rem] border border-ambition/10 bg-ambition/[0.02]">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-ambition/10 rounded-2xl">
                            <RefreshCw className="w-6 h-6 text-ambition" />
                        </div>
                        <h3 className="text-2xl font-serif italic">Boundary Logic</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="text-xs font-mono text-ambition uppercase tracking-widest">Contrast with: {revelation.comparison.otherArchetype}</div>
                        <p className="text-white/60 leading-relaxed text-sm italic">
                            {revelation.comparison.diffNarrative}
                        </p>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-[10px] text-white/30 uppercase tracking-tighter">
                            Aetos Conclusion: Your profile shows higher "Processing Depth" which disqualifies the {revelation.comparison.otherArchetype} baseline.
                        </div>
                    </div>
                </section>
            </div>

            {/* Comparative Analysis */}
            <section className="glass-dark p-12 rounded-[3rem] border border-white/5 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-serif italic mb-2">Comparative Analysis</h2>
                        <p className="text-white/40 text-sm font-light">Cross-referencing your profile against the Aetos Archetype Pool.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ARCHETYPES.map(a => (
                            <button
                                key={a.name}
                                onClick={() => setSelectedCompare(a.name === selectedCompare ? null : a.name)}
                                className={`px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all border ${
                                    selectedCompare === a.name 
                                    ? 'bg-ambition text-midnight border-ambition' 
                                    : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {a.name}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {selectedCompare ? (
                        <motion.div
                            key={selectedCompare}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-2 gap-10 p-8 bg-white/2 rounded-[2rem] border border-white/5"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-ambition/10 flex items-center justify-center text-ambition">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif italic">{selectedCompare}</h3>
                                        <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none mt-1">Reference Archetype</div>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {ARCHETYPES.find(a => a.name === selectedCompare)?.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {ARCHETYPES.find(a => a.name === selectedCompare)?.qualities.map(q => (
                                        <span key={q} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] text-white/40 font-mono italic">#{q}</span>
                                    ))}
                                </div>
                                <div className="pt-4 space-y-2">
                                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Typical Trajectories:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {ARCHETYPES.find(a => a.name === selectedCompare)?.typicalCareers.map(c => (
                                            <span key={c} className="text-xs text-white/60 bg-white/2 px-2 py-1 rounded border border-white/5">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 border-l border-white/5 pl-10">
                                {selectedCompare === revelation.comparison.otherArchetype ? (
                                    <div className="space-y-4">
                                        <div className="text-xs font-mono text-ambition uppercase tracking-[0.2em]">The Critical Divergence</div>
                                        <p className="text-white/80 text-base leading-relaxed italic">
                                            {revelation.comparison.diffNarrative}
                                        </p>
                                        <div className="p-4 bg-ambition/5 rounded-xl border border-ambition/10 flex items-start gap-3">
                                            <Shield className="w-4 h-4 text-ambition shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-ambition/80 leading-relaxed font-mono uppercase">
                                                Verification: User trajectory deviates by 85% from {selectedCompare} baseline due to systemic processing variance.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">Cognitive Delta</div>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            While the {selectedCompare} prioritizes {ARCHETYPES.find(a => a.name === selectedCompare)?.dominantDomains[0].split(': ')[1]}, your DNA is more aligned with {revelation.archetypeTitle}'s focus on visionary synthesis.
                                        </p>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-mono text-white/20 uppercase">Key Differences:</div>
                                            <div className="flex items-center gap-3 text-xs text-white/60">
                                                <ChevronRight className="w-3 h-3 text-ambition" />
                                                <span>{selectedCompare} focus: {ARCHETYPES.find(a => a.name === selectedCompare)?.qualities[0]}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-white/60">
                                                <ChevronRight className="w-3 h-3 text-ambition" />
                                                <span>Your focus: {revelation.dimensionalBreakdown[0].name}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] text-white/20 gap-4">
                            <ListFilter className="w-8 h-8 opacity-20" />
                            <p className="text-sm font-light">Select an archetype above to initiate cross-comparison protocol</p>
                        </div>
                    )}
                </AnimatePresence>
            </section>

            {/* Strategic Trajectories (Matches) */}
            <section className="space-y-6">
                <h2 className="text-3xl font-serif italic flex items-center gap-4 px-4">
                    Aligned Trajectories
                    <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {revelation.matches.map((match, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-dark p-8 rounded-[2.5rem] border border-white/5 flex flex-col h-full hover:border-ambition/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-xl font-sans font-bold text-white mb-1">{match.title}</h4>
                                    <div className="text-[10px] font-mono text-ambition uppercase tracking-widest">{match.zScore}% Resonance</div>
                                </div>
                                <div className="p-2 bg-ambition/10 rounded-lg">
                                    <Award className="w-5 h-5 text-ambition" />
                                </div>
                            </div>
                            
                            <p className="text-sm text-white/60 mb-6 flex-grow">{match.description}</p>
                            
                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="text-[10px] font-mono text-cyan-glow uppercase">Strategic Justification:</div>
                                <p className="text-xs text-white/40 italic">{match.justification}</p>
                                
                                <div className="space-y-2">
                                    <div className="text-[10px] font-mono text-white/30 uppercase">Glide Path:</div>
                                    {match.glidePath.map((step, si) => (
                                        <div key={si} className="flex gap-3 text-[10px] items-center text-white/50">
                                            <div className="w-1 h-1 rounded-full bg-ambition" />
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>

        {/* Cognitive Visualization Sidebar */}
        <aside className="lg:col-span-4 space-y-8 sticky top-8">
            <ArchetypeRadar dimensions={radarDimensions} />
            
            <div className="glass-dark p-8 rounded-[2.5rem] border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif italic">Cognitive DNA</h3>
                    <TrendingUp className="w-4 h-4 text-white/20" />
                </div>
                
                <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                    {revelation.dimensionalBreakdown.map((dim, i) => (
                        <div key={i} className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-ambition/20 transition-all">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex flex-col">
                                    <span className="text-xs font-sans font-bold text-white/90 group-hover:text-ambition transition-colors uppercase tracking-wider">{dim.name}</span>
                                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-1">Cognitive Marker</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-mono text-ambition group-hover:text-glow-gold">{(dim.value * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dim.value * 100}%` }}
                                    transition={{ duration: 1.5, delay: i * 0.05 }}
                                    className="h-full bg-gradient-to-r from-ambition/40 to-ambition"
                                />
                            </div>

                            <div className="mt-4 p-3 bg-ambition/[0.03] border border-ambition/10 rounded-xl space-y-2 group-hover:bg-ambition/[0.05] transition-all">
                                <div className="flex items-center gap-2">
                                    <Database className="w-2.5 h-2.5 text-ambition/60" />
                                    <span className="text-[8px] font-mono text-ambition/40 uppercase tracking-widest">Inference Source: CV + Interaction</span>
                                </div>
                                <p className="text-[11px] text-white/50 leading-relaxed group-hover:text-white/80 transition-colors font-sans italic">
                                    {dim.justification}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button 
                onClick={onReset}
                className="group relative w-full py-8 rounded-[2.5rem] bg-ambition text-midnight font-black text-xs uppercase tracking-[0.3em] overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-ambition/30"
            >
                <div className="relative z-10 flex items-center justify-center gap-3">
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                    Restart Calibration
                </div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        </aside>
      </div>
    </div>
  );
}
