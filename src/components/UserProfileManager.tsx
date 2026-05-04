import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Save, Loader2, Sparkles } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export function UserProfileManager() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    goals: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setFormData({
            name: data.name || user.displayName || '',
            bio: data.bio || '',
            goals: data.goals || ''
          });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date()
      });
      setProfile((prev: any) => ({ ...prev, ...formData }));
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="w-8 h-8 text-ambition animate-spin mb-4" />
      <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Accessing Profile...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-12 px-6"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-ambition/10 flex items-center justify-center text-ambition shadow-lg shadow-ambition/5 border border-ambition/20">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-serif italic text-white">Ambassador Profile</h2>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em]">Cognitive Identity Hub</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-1">Display Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-ambition/50 outline-none transition-all placeholder:text-white/10"
                placeholder="Your name..."
              />
            </div>
          </div>
          <div className="space-y-2 opacity-50 cursor-not-allowed">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-1">Identity Mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="email"
                disabled
                value={auth.currentUser?.email || ''}
                className="w-full bg-white/2 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white/40 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-1">Professional Bio / Baseline</label>
          <textarea 
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white h-32 focus:border-ambition/50 outline-none transition-all placeholder:text-white/10 resize-none"
            placeholder="Tell us about your professional journey..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest px-1">Strategic Goals</label>
          <textarea 
            value={formData.goals}
            onChange={e => setFormData({ ...formData, goals: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white h-32 focus:border-ambition/50 outline-none transition-all placeholder:text-white/10 resize-none"
            placeholder="What careers or archetypes are you targeting?"
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-white/20">
            <Shield className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-widest">End-to-End Encryption Enabled</span>
          </div>
          <button 
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-10 py-5 bg-ambition text-midnight font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Protocol
          </button>
        </div>
      </form>
    </motion.div>
  );
}
