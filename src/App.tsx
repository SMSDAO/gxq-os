import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Desktop } from './components/os/Desktop';
import { Onboarding } from './components/os/Onboarding';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const { user, profile, loading, login, refreshProfile } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen bg-dragon-bg flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-dragon-primary animate-spin" />
          <div className="absolute inset-0 bg-dragon-primary/20 blur-xl rounded-full" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-[0.2em] text-white/90">KALI CLOUD OS</h1>
          <p className="text-[10px] text-dragon-primary font-bold mt-1 uppercase tracking-widest">Dragon Core Omega Initializing...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen bg-dragon-bg relative overflow-hidden flex items-center justify-center p-6">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.05),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative z-10"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dragon-primary to-dragon-secondary flex items-center justify-center mb-8 shadow-lg shadow-dragon-primary/20">
            <ShieldCheck className="w-12 h-12 text-black" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Access Control</h1>
          <p className="text-sm text-white/40 mb-10 leading-relaxed">
            Enterprise Cloud Desktop OS <br/>
            <span className="font-mono text-[10px] text-dragon-primary uppercase tracking-widest">DRAGON CORE OMEGA // V16.0.0</span>
          </p>

          <button 
            onClick={login}
            className="w-full h-14 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-95 group shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            <span>Sign in with Enterprise ID</span>
          </button>

          <div className="mt-12 flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <Lock className="w-5 h-5" />
            <div className="w-1 h-1 bg-white/40 rounded-full" />
            <span className="text-[10px] font-bold tracking-widest">ZERO TRUST SECURITY</span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-[10px] font-mono text-white/10 select-none">
          SECURE_BOOT_SEQ: 0x88FF00D5<br/>
          KERNEL_AUTH: VERIFIED<br/>
          ENCRYPTION: AES_256_GCM
        </div>
      </div>
    );
  }

  if (profile && !profile.onboarded) {
    return <Onboarding user={user} onComplete={refreshProfile} />;
  }

  return <Desktop />;
}
