import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  RefreshCcw,
  Zap,
  Globe,
  Building,
  Layout
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firestore-errors';
import { FeatureFlag, FeatureFlagScope } from '../../lib/featureFlags';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function AdminCenter() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFlags = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'feature_flags'));
      const list: FeatureFlag[] = [];
      snap.forEach(doc => list.push(doc.data() as FeatureFlag));
      setFlags(list);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'feature_flags');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const toggleFlag = async (flag: FeatureFlag) => {
    const updated = { ...flag, enabled: !flag.enabled };
    try {
      await setDoc(doc(db, 'feature_flags', flag.key), updated);
      setFlags(prev => prev.map(f => f.key === flag.key ? updated : f));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `feature_flags/${flag.key}`);
    }
  };

  const createFlag = async () => {
    const key = `feature_${Math.random().toString(36).substr(2, 5)}`;
    const newFlag: FeatureFlag = {
      key,
      enabled: false,
      scope: 'GLOBAL',
      description: 'New system feature'
    };
    try {
      await setDoc(doc(db, 'feature_flags', key), newFlag);
      setFlags([...flags, newFlag]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `feature_flags/${key}`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-white">
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-dragon-primary" />
          <h2 className="text-lg font-black tracking-tight">KALI ADMIN CENTER</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchFlags} className="p-2 hover:bg-white/5 rounded-lg text-white/40">
            <RefreshCcw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
          <button 
            onClick={createFlag}
            className="flex items-center gap-2 px-4 py-2 bg-dragon-primary text-black text-xs font-black rounded-lg hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> NEW FLAG
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Feature Flags & Rollouts</h3>
            {flags.map(flag => (
              <div key={flag.key} className="glass rounded-2xl p-6 flex items-center justify-between group border-white/5 hover:border-dragon-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-xl",
                    flag.enabled ? "bg-dragon-primary/10 text-dragon-primary" : "bg-white/5 text-white/20"
                  )}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {flag.key}
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.5 rounded border uppercase",
                        flag.scope === 'GLOBAL' ? "border-cyan-500/50 text-cyan-400" :
                        flag.scope === 'ORG' ? "border-purple-500/50 text-purple-400" : "border-yellow-500/50 text-yellow-400"
                      )}>
                        {flag.scope}
                      </span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">{flag.description}</div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleFlag(flag)}
                  className="transition-transform active:scale-90"
                >
                  {flag.enabled ? (
                    <ToggleRight className="w-10 h-10 text-dragon-primary" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-white/20" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">System Health</h3>
            <div className="glass rounded-2xl p-6 space-y-4">
              <StatRow label="Core Nodes" value="Active" color="text-dragon-primary" />
              <StatRow label="RBAC Engine" value="Stable" color="text-dragon-primary" />
              <StatRow label="AI Neurons" value="Firing" color="text-yellow-400" />
              <StatRow label="Auth Tokens" value="99.9%" color="text-dragon-primary" />
            </div>

            <div className="glass rounded-2xl p-6 bg-gradient-to-br from-dragon-primary/10 to-transparent border-dragon-primary/20">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Deployment Tip
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Use Feature Flags for canary releases. Enable globally to rollout to all users, or target specific Organizations for beta testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40">{label}</span>
      <span className={cn("text-xs font-bold font-mono", color)}>{value}</span>
    </div>
  );
}
