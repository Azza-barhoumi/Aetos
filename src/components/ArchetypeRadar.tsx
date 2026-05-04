import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PersonaDimension } from '../types';
import { AETOS_DOMAINS } from '../constants/dimensions';

interface ArchetypeRadarProps {
  dimensions: PersonaDimension[];
}

export function ArchetypeRadar({ dimensions }: ArchetypeRadarProps) {
  const domainExplanations: Record<string, string> = {
    "Cognitive Complexity": "Processing depth, systemic synthesis, and abstract pattern recognition.",
    "Execution Force": "Operational speed, precision, and tactical adaptability in high-stress environments.",
    "Social Resonance": "Influence, empathetic accuracy, and diplomatic navigation of complex human systems.",
    "Strategic Depth": "Macro-trend anticipation, visionary sighting, and long-term systemic impact.",
    "Emotional Architecture": "Resilience, self-regulation, and alignment between purpose and action."
  };

  const data = useMemo(() => {
    return AETOS_DOMAINS.map(domain => {
      const domainDims = dimensions.filter(d => d.domain === domain);
      const avgScore = domainDims.length > 0 
        ? domainDims.reduce((acc, curr) => acc + curr.score, 0) / domainDims.length
        : 0;
      
      return {
        subject: domain,
        A: avgScore * 100,
        fullMark: 100,
        explanation: domainExplanations[domain],
        topDimensions: domainDims.sort((a, b) => b.score - a.score).slice(0, 3).map(d => ({ name: d.name, score: d.score * 100 }))
      };
    });
  }, [dimensions]);

  return (
    <div className="w-full h-[400px] bg-white/2 overflow-hidden rounded-3xl border border-white/5 p-6 relative">
      <div className="absolute top-6 left-6 z-10">
        <h4 className="text-[10px] font-mono text-ambition uppercase tracking-[0.3em]">Cognitive Signature</h4>
        <div className="text-2xl font-serif italic text-white/90">Aetos Spectrum v1.4</div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#ffffff10" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'font-mono' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Professional DNA"
            dataKey="A"
            stroke="#D4AF37"
            fill="#D4AF37"
            fillOpacity={0.4}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="glass-dark border border-ambition/30 p-4 rounded-xl max-w-[200px]">
                    <div className="text-ambition font-mono text-[10px] uppercase mb-1">{data.subject}</div>
                    <div className="text-white font-bold text-lg mb-2">{data.A.toFixed(0)}%</div>
                    <div className="text-white/40 text-[9px] leading-relaxed italic mb-3">{data.explanation}</div>
                    <div className="space-y-1 pt-2 border-t border-white/10">
                        {data.topDimensions.map((td: any) => (
                            <div key={td.name} className="flex justify-between text-[8px] font-mono">
                                <span className="text-white/30">{td.name}</span>
                                <span className="text-ambition">{td.score.toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
