/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Blueprint } from './components/Blueprint';
import { LivePulse } from './components/LivePulse';
import { AetosChat } from './components/AetosChat';
import { Revelation } from './components/Revelation';
import { CVLoom } from './components/CVLoom';
import { CareerPassport } from './components/CareerPassport';
import { SessionSidebar } from './components/SessionSidebar';
import { UserProfileManager } from './components/UserProfileManager';
import { ArrowRight, ChevronLeft, Bird, LayoutDashboard, Compass, Cpu, Shield, LogIn, Sparkles, RefreshCw, UserCircle2 } from 'lucide-react';
import { auth, signInWithGoogle, getSession } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type JourneyStep = 'landing' | 'conversation' | 'dashboard' | 'pathfinder' | 'passport' | 'profile';

export default function App() {
  const [step, setStep] = useState<JourneyStep>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [synthesisData, setSynthesisData] = useState<any>(null);
  const [shouldTriggerCV, setShouldTriggerCV] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  const handleStepChange = (newStep: JourneyStep) => {
    if (!user && newStep !== 'landing') {
      signInWithGoogle();
      return;
    }
    setStep(newStep);
  };

  const handleSelectSession = async (sessionId: string) => {
    if (!user) return;
    setCurrentSessionId(sessionId);
    const session = await getSession(user.uid, sessionId);
    if (session) {
      if (session.revelation) {
        setSynthesisData(session.revelation);
        setStep('dashboard');
      } else {
        setSynthesisData(null);
        setStep('conversation');
      }
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setSynthesisData(null);
    setShouldTriggerCV(false);
    setStep('conversation');
  };

  const handleSynthesisComplete = (data: any) => {
    setSynthesisData(data);
    setStep('dashboard');
  };

  const handleStartWithCV = () => {
    setShouldTriggerCV(true);
    handleStepChange('conversation');
  };

  return (
    <div className="relative min-h-screen bg-midnight selection:bg-ambition selection:text-midnight">
      {/* Background System */}
      <div className="fixed inset-0 data-grid-bg opacity-10 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] mythic-gradient opacity-40 pointer-events-none blur-3xl" />
      
      <Header />
      
      {user && (
        <SessionSidebar 
          currentSessionId={currentSessionId} 
          onSelectSession={handleSelectSession} 
          onNewChat={handleNewChat}
        />
      )}

      <main className="relative z-10 pt-24 pb-40">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onUpload={handleStartWithCV} />
              <Blueprint />
              <LivePulse />
              <div className="flex justify-center mt-12 mb-20 px-6">
                {!user ? (
                   <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={signInWithGoogle}
                    className="group relative flex items-center gap-6 px-14 py-8 glass-dark border-2 border-ambition/20 hover:border-ambition rounded-[2rem] transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-ambition/5 group-hover:bg-ambition/10 transition-colors" />
                    <div className="relative z-10 text-left">
                      <span className="block text-xs font-mono text-ambition uppercase tracking-[0.3em] font-black mb-2">Access Portal</span>
                      <span className="text-2xl font-serif font-bold uppercase tracking-tighter">Sign In to Begin</span>
                    </div>
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-ambition text-midnight flex items-center justify-center shadow-2xl shadow-ambition/30 group-hover:rotate-6 transition-transform">
                      <LogIn className="w-8 h-8" />
                    </div>
                  </motion.button>
                ) : (
                  <button 
                    onClick={() => handleStepChange('conversation')}
                    className="group relative px-14 py-8 glass-dark border-2 border-ambition/20 hover:border-ambition rounded-[2rem] transition-all overflow-hidden flex items-center gap-6"
                  >
                    <div className="absolute inset-0 bg-ambition/5 group-hover:bg-ambition/10 transition-colors" />
                    <div className="relative z-10 text-left">
                      <span className="block text-xs font-mono text-ambition uppercase tracking-[0.3em] font-black mb-2">Authenticated</span>
                      <span className="text-2xl font-serif font-bold uppercase tracking-tighter">Enter the Aetos Chamber</span>
                    </div>
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-ambition text-midnight flex items-center justify-center shadow-2xl shadow-ambition/30 group-hover:rotate-6 transition-transform">
                      <Bird className="w-8 h-8" />
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'conversation' && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="px-6"
            >
              <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <button 
                  onClick={() => handleStepChange('landing')}
                  className="flex items-center gap-2 text-[10px] font-mono text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Exit Calibration
                </button>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-ambition/10 border border-ambition/30 rounded-full text-[10px] font-mono text-ambition uppercase">Stage 1: Inference</div>
                </div>
              </div>
              <AetosChat 
                userContext={user} 
                onComplete={handleSynthesisComplete} 
                autoTriggerCV={shouldTriggerCV}
                sessionId={currentSessionId ?? undefined}
                onSessionCreated={setCurrentSessionId}
              />
            </motion.div>
          )}

          {step === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-6 space-y-12 pb-20"
            >
              {!synthesisData ? (
                  <div className="h-[400px] flex flex-col items-center justify-center gap-6">
                      <div className="w-16 h-16 rounded-3xl border border-ambition flex items-center justify-center animate-spin">
                          <RefreshCw className="text-ambition" />
                      </div>
                      <p className="text-white/40 font-mono text-xs uppercase animate-pulse">Waiting for Calibration...</p>
                  </div>
              ) : (
                <>
                    <Revelation profile={{ ...user, revelation: synthesisData } as any} onReset={() => setStep('conversation')} />
                    
                    <div className="max-w-4xl mx-auto p-8 glass-dark rounded-3xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Bird className="w-24 h-24 text-ambition" />
                        </div>
                        <h3 className="text-2xl font-serif mb-4 uppercase tracking-tighter italic">Evolutionary Track</h3>
                        <p className="text-white/60 text-sm mb-6 max-w-xl">
                            Your Echo suggests a 3-month focused track. To proceed, optimize your digital footprint with the Aetos Loom.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => handleStepChange('pathfinder')}
                                className="px-6 py-3 bg-cyan-glow text-midnight font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                Access Ingestion Loom
                            </button>
                            <button 
                                onClick={() => handleStepChange('passport')}
                                className="px-6 py-3 bg-ambition text-midnight font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                Generate Agency Echo
                            </button>
                        </div>
                    </div>
                </>
              )}
            </motion.div>
          )}

          {step === 'pathfinder' && (
             <motion.div
               key="pathfinder"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-4xl mx-auto px-6"
             >
               <CVLoom />
             </motion.div>
          )}

          {step === 'passport' && (
             <motion.div
               key="passport"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-4xl mx-auto px-6"
             >
               <CareerPassport />
             </motion.div>
          )}

          {step === 'profile' && (
             <motion.div
               key="profile"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
             >
               <UserProfileManager />
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Rail (Mobile-Optimized) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-dark rounded-full p-2 border-white/10 shadow-2xl flex items-center gap-2">
        <NavButton active={step === 'landing'} onClick={() => handleStepChange('landing')} icon={<Compass />} label="Explore" />
        <NavButton active={step === 'conversation'} onClick={() => handleStepChange('conversation')} icon={<Bird />} label="Aetos" />
        <NavButton active={step === 'dashboard'} onClick={() => handleStepChange('dashboard')} icon={<LayoutDashboard />} label="Revelation" />
        <NavButton active={step === 'profile'} onClick={() => handleStepChange('profile')} icon={<UserCircle2 />} label="Profile" />
        <NavButton active={step === 'pathfinder'} onClick={() => handleStepChange('pathfinder')} icon={<Cpu />} label="Loom" />
        <NavButton active={step === 'passport'} onClick={() => handleStepChange('passport')} icon={<Shield />} label="Passport" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded-full flex items-center gap-2 transition-all group ${active ? 'bg-ambition text-midnight' : 'text-white/40 hover:text-white'}`}
    >
      <div className={`${active ? '' : 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </div>
      <span className={`text-[10px] font-mono uppercase tracking-tighter font-bold transition-all ${active ? 'w-auto opacity-100' : 'w-0 opacity-0 overflow-hidden group-hover:w-auto group-hover:opacity-100 group-hover:ml-1'}`}>
        {label}
      </span>
    </button>
  );
}
