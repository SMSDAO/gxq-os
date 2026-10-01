import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  FolderOpen,
  ArrowRight,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface OnboardingProps {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  };
  onComplete: () => void;
}

export function Onboarding({ user, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: "Welcome to Dragon Core",
      subtitle: "The Elite Cloud OS experience begins now.",
      icon: Rocket,
      color: "text-dragon-primary"
    },
    {
      title: "Enroll Organization",
      subtitle: "Establish your enterprise identity cluster.",
      icon: Building2,
      color: "text-cyan-400"
    },
    {
      title: "Security Clearance",
      subtitle: "Initializing Zero-Trust protocols.",
      icon: ShieldCheck,
      color: "text-emerald-400"
    },
    {
      title: "Operational Briefing",
      subtitle: "Your toolset is ready for deployment.",
      icon: Terminal,
      color: "text-purple-400"
    }
  ];

  const handleNext = async () => {
    if (step === 1 && !orgName) return;
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const orgId = `org_${Math.random().toString(36).substr(2, 9)}`;
        const wsId = `ws_${Math.random().toString(36).substr(2, 9)}`;

        // Create Org
        try {
          await setDoc(doc(db, 'organizations', orgId), {
            id: orgId,
            name: orgName,
            ownerId: user.uid,
            tier: 'ENTERPRISE',
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `organizations/${orgId}`);
        }

        // Create Workspace
        try {
          await setDoc(doc(db, 'workspaces', wsId), {
            id: wsId,
            orgId: orgId,
            name: 'Main Operations',
            createdBy: user.uid,
            createdAt: new Date().toISOString()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `workspaces/${wsId}`);
        }

        // Update User
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            orgId: orgId,
            onboarded: true
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
        }

        onComplete();
      } catch (error) {
        console.error("Onboarding failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-[10000] bg-dragon-bg flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.1),transparent)] pointer-events-none" />
      
      <motion.div 
        layout
        className="max-w-2xl w-full glass rounded-[2rem] p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <motion.div 
            className="h-full bg-dragon-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center text-center"
          >
            <div className={cn("w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-8", steps[step].color)}>
              <CurrentIcon className="w-12 h-12" />
            </div>

            <h1 className="text-3xl font-black text-white mb-4 tracking-tight">{steps[step].title}</h1>
            <p className="text-white/40 mb-10 text-lg leading-relaxed">{steps[step].subtitle}</p>

            {step === 1 && (
              <div className="w-full max-w-md mb-10">
                <input 
                  type="text"
                  placeholder="Organization Name (e.g. Acme Corp)"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full h-14 glass rounded-2xl px-6 text-white text-lg outline-none focus:ring-1 focus:ring-dragon-primary/50 transition-all text-center"
                  autoFocus
                />
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <FeatureHighlight 
                  icon={FolderOpen} 
                  title="Virtual File System" 
                  desc="Enterprise VFS with persistent nodes." 
                />
                <FeatureHighlight 
                  icon={Cpu} 
                  title="AI Copilot" 
                  desc="Dynamic prompt engineering at scale." 
                />
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={isSubmitting || (step === 1 && !orgName)}
              className="group flex items-center gap-3 px-8 py-4 bg-dragon-primary text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{step === steps.length - 1 ? 'DEPLOY OS' : 'CONTINUE'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Decorative Matrix Rain Placeholder */}
      <div className="absolute top-10 right-10 text-[10px] font-mono text-dragon-primary/10 select-none">
        DRAGON_INIT_SEQ: 0x{step}<br/>
        ENROLL_CLUSTER: {orgName || 'PENDING'}<br/>
        SECURITY_LEVEL: OMEGA
      </div>
    </div>
  );
}

function FeatureHighlight({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass rounded-2xl p-6 text-left border-white/5">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-dragon-primary" />
        <span className="text-sm font-bold text-white">{title}</span>
      </div>
      <p className="text-[11px] text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}
