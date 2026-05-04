import { useState } from "react";
import { Shield, Share2, Eye, EyeOff, Globe, Lock } from "lucide-react";
import { motion } from "motion/react";

export function CareerPassport() {
  const [isShared, setIsShared] = useState(false);
  const [passportData, setPassportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleShare = async () => {
    if (!isShared) {
      setIsLoading(true);
      try {
        // Generating passport via our backend API
        const response = await fetch("/api/v2/career-passport/user-123?job_id=bi-dev");
        const data = await response.json();
        setPassportData(data.passport);
        setIsShared(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsShared(false);
      setPassportData(null);
    }
  };

  return (
    <div className="glass-dark rounded-3xl p-8 border border-ambition/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Shield className="w-32 h-32 text-ambition" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-2xl font-serif uppercase tracking-tight">Career <span className="italic text-ambition">Passport</span></h3>
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">Sovereign Identity Protection</p>
          </div>
          <button 
            onClick={toggleShare}
            disabled={isLoading}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all font-mono text-[10px] uppercase tracking-widest ${isShared ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-ambition text-midnight font-bold'}`}
          >
            {isLoading ? "Generating..." : isShared ? <><EyeOff className="w-4 h-4" /> Revoke Access</> : <><Share2 className="w-4 h-4" /> Share Anonymized Profile</>}
          </button>
        </div>

        {isShared && passportData ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PassportStat label="Anonymized ID" value={passportData.anonymizedId} />
              <PassportStat label="Z-Score" value={`${passportData.zScore}%`} />
              <PassportStat label="Verified Skills" value={passportData.verifiedSkills.length.toString()} />
              <PassportStat label="Privacy Level" value="Level 4 (AES-256)" />
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 font-mono text-[10px] text-white/40 leading-relaxed">
              <code className="block">
                {JSON.stringify(passportData, null, 2)}
              </code>
            </div>

            <div className="flex items-center gap-4 p-4 bg-ambition/5 border border-ambition/20 rounded-2xl">
              <Globe className="w-5 h-5 text-ambition shrink-0" />
              <p className="text-xs text-white/70 italic">
                Your passport is now accessible to partner agencies via the <strong>Agency Link</strong>. 
                Recruiters see your potential, not your PII.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
            <Lock className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white/30 text-sm max-w-sm font-sans">
              Connect with leading employers while keeping your identity private. 
              Only your work archetype and verified skills are shared.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PassportStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-bold text-ambition">{value}</div>
    </div>
  );
}
