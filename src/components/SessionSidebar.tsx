import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MessageSquare, History, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSessions, auth } from '../services/firebase';
import { ChatSession } from '../types';

interface SessionSidebarProps {
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export function SessionSidebar({ currentSessionId, onSelectSession, onNewChat }: SessionSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      const user = auth.currentUser;
      if (user) {
        setLoading(true);
        try {
          const fetched = await getSessions(user.uid);
          setSessions(fetched);
        } catch (e) {
          console.error("Failed to load sessions", e);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      loadSessions();
    }
  }, [isOpen, currentSessionId]);

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-[60] p-3 glass-dark border border-white/10 rounded-r-2xl transition-all ${isOpen ? 'left-80' : 'left-0'}`}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5 text-white/40" /> : <ChevronRight className="w-5 h-5 text-ambition" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed top-0 left-0 bottom-0 w-80 z-50 glass-dark border-r border-white/10 pt-24 pb-32 flex flex-col"
          >
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/60">
                <History className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Past Inferences</span>
              </div>
              <button 
                onClick={() => {
                  onNewChat();
                  setIsOpen(false);
                }}
                className="p-2 hover:bg-ambition/10 rounded-lg text-ambition transition-colors"
                title="New Calibration"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
              {loading && sessions.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-6 h-6 border-2 border-ambition/30 border-t-ambition rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[10px] font-mono text-white/20 uppercase">Retrieving Sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-center py-10 text-[10px] font-mono text-white/20 uppercase">No history found</p>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                      currentSessionId === session.id 
                      ? 'bg-ambition/10 border-ambition/30 text-white' 
                      : 'bg-white/2 border-white/5 text-white/40 hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-lg ${currentSessionId === session.id ? 'bg-ambition/20 text-ambition' : 'bg-white/5 text-white/20'}`}>
                        <MessageSquare className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate mb-1 ${currentSessionId === session.id ? 'text-white' : 'text-white/60'}`}>
                          {session.title || 'Untitled Calibration'}
                        </div>
                        <div className="text-[9px] font-mono text-white/20 uppercase">
                          {new Date(session.updatedAt?.seconds * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="mt-auto p-6 border-t border-white/5">
              <button 
                onClick={onNewChat}
                className="w-full py-4 bg-ambition text-midnight font-black text-[10px] uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start New calibration
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
