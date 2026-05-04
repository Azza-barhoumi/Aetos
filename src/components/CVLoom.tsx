import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FileText, Cpu, Check, Loader2, Info } from "lucide-react";
import { getGemini, GEMINI_MODEL } from "../services/geminiService";

export function CVLoom() {
  const [cvText, setCvText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCv, setOptimizedCv] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!cvText || !jobDesc) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const ai = getGemini();
      const systemInstruction = `
        You are the Aetos CV Loom, a high-precision semantic alignment engine.
        Your task is to re-weave the following CV text to perfectly align with the target Job Description.
        Maintain absolute integrity of the original facts, but shift the narrative focus, keywords, and priority to match the job requirements.
        Use a high-fidelity, professional, and slightly strategic tone.
        Return ONLY the optimized CV text. No conversational filler.
      `;

      const prompt = `
        ORIGINAL CV:
        ${cvText}
        
        TARGET JOB DESCRIPTION:
        ${jobDesc}
      `;

      const result = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          systemInstruction,
        }
      });
      
      const text = result.text;
      if (!text) throw new Error("Recieved empty response from Aetos Protocol.");
      
      setOptimizedCv(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during optimization.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="glass-dark rounded-3xl p-8 border border-white/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 flex items-center justify-center text-cyan-glow">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-serif uppercase tracking-tight">CV <span className="italic text-cyan-glow">Loom</span></h3>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Semantic Alignment Engine</p>
        </div>
      </div>

      {!optimizedCv ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase ml-2">Current Resume</label>
              <textarea 
                value={cvText}
                onChange={e => setCvText(e.target.value)}
                placeholder="Paste your CV text here..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-cyan-glow/50 text-sm font-sans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/40 uppercase ml-2">Target Job Description</label>
              <textarea 
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                placeholder="Paste the job description..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-cyan-glow/50 text-sm font-sans"
              />
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-mono">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3 h-3" />
                <span className="font-bold">SYSTEM ERROR</span>
              </div>
              {error}
            </div>
          )}
          <button 
            onClick={handleOptimize}
            disabled={!cvText || !jobDesc || isOptimizing}
            className="w-full py-4 bg-cyan-glow text-midnight font-bold rounded-xl uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isOptimizing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Weave Optimized CV"}
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="p-6 bg-cyan-glow/5 border border-cyan-glow/20 rounded-2xl">
            <h4 className="flex items-center gap-2 text-cyan-glow text-sm font-bold mb-4">
              <Check className="w-4 h-4" /> ALIGNMENT COMPLETE
            </h4>
            <div className="prose prose-invert prose-sm max-w-none text-white/70 whitespace-pre-wrap font-sans leading-relaxed">
              {optimizedCv}
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setOptimizedCv(null)}
              className="flex-1 py-3 glass-dark border border-white/10 rounded-xl text-xs uppercase font-mono"
            >
              Back to Loom
            </button>
            <button className="flex-1 py-3 bg-ambition text-midnight font-bold rounded-xl text-xs uppercase tracking-widest">
              Sync to Passport
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
