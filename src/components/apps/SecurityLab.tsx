import React, { useState } from 'react';
import { Shield, Lock, Bug, Terminal, AlertTriangle, Eye, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tools = [
  { id: 'recon', name: 'Reconnaissance', icon: Eye, color: 'text-cyan-400', desc: 'Scan target for vulnerabilities (Simulated)' },
  { id: 'exploit', name: 'Exploitation', icon: Bug, color: 'text-red-400', desc: 'Launch educational exploits in sandbox' },
  { id: 'crypto', name: 'Cryptography', icon: Lock, color: 'text-purple-400', desc: 'Secure message encryption and hashing' },
  { id: 'network', name: 'Network Analysis', icon: Activity, color: 'text-dragon-primary', desc: 'Traffic flow visualization' },
];

export function SecurityLab() {
  const [activeTab, setActiveTab] = useState('recon');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Security Lab initialized...', '[READY] Waiting for educational commands.']);

  const runSim = (name: string) => {
    setLogs(prev => [...prev, `[INIT] Running ${name} simulation...`, `[SCAN] Checking sub-networks...`, `[SUCCESS] 0 vulnerabilities found in secure host.`]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-white">
      {/* Sidebar */}
      <div className="flex h-full">
        <div className="w-64 border-r border-white/5 bg-black/20 p-4 flex flex-col gap-2">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 px-2">Toolsets</div>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all text-sm group",
                activeTab === tool.id ? "bg-white/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white/60"
              )}
            >
              <tool.icon className={cn("w-5 h-5", activeTab === tool.id ? tool.color : "text-current")} />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold mb-1">Dragon Core Security Lab</h2>
              <p className="text-xs text-white/40 italic">Educational security simulation environment (Sandboxed)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 glass-emerald text-xs rounded-lg font-bold hover:neon-glow-emerald transition-all" onClick={() => runSim('Full Recon')}>
                RUN DIAGNOSTIC
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Visualizer Panel */}
            <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden border-dragon-primary/20">
              <Shield className="w-32 h-32 text-dragon-primary/20 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-dragon-primary/5 to-transparent pointer-events-none" />
              <div className="mt-4 text-center">
                <div className="text-dragon-primary font-bold text-lg">System Integrity: 100%</div>
                <div className="text-[10px] text-white/40 mt-1">NO THREATS DETECTED</div>
              </div>
            </div>

            {/* Terminal Output Panel */}
            <div className="glass rounded-2xl flex flex-col overflow-hidden border-white/5">
              <div className="h-8 bg-black/40 flex items-center px-4 border-b border-white/5">
                <Terminal className="w-3 h-3 text-white/40 mr-2" />
                <span className="text-[10px] font-mono text-white/40">OUTPUT CONSOLE</span>
              </div>
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className={cn(
                    log.includes('[SUCCESS]') ? 'text-dragon-primary' : 
                    log.includes('[SYSTEM]') ? 'text-cyan-400' : 'text-white/60'
                  )}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
