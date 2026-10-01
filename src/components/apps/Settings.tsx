import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Monitor, 
  Bell, 
  Globe, 
  Database, 
  HelpCircle,
  CreditCard,
  Github,
  Link2,
  RefreshCw,
  Check,
  GitBranch
} from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { GitHubSyncService, GitHubRepo } from '../../lib/githubSync';

export function Settings() {
  const { wallpaper, setWallpaper } = useOSStore();
  const [activeTab, setActiveTab] = useState('Personalization');
  const [ghConnected, setGhConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      
      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        setAccessToken(event.data.token);
        setGhConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const connectGitHub = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      const { url } = await res.json();
      window.open(url, 'github_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to initiate GitHub link:', error);
    }
  };

  const syncRepos = async () => {
    if (!accessToken) return;
    setIsSyncing(true);
    // Simulation of sync logic using the token
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const wallpapers = [
    { name: 'Dragon Core', url: '/src/assets/images/dragon_core_wallpaper_1790871978331.jpg' },
    { name: 'Midnight Void', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
    { name: 'Cyber Grid', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop' },
  ];

  return (
    <div className="w-full h-full flex bg-[#020617] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col p-6 gap-2">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        <SettingsNavItem icon={User} label="Accounts" active={activeTab === 'Accounts'} onClick={() => setActiveTab('Accounts')} />
        <SettingsNavItem icon={Monitor} label="Personalization" active={activeTab === 'Personalization'} onClick={() => setActiveTab('Personalization')} />
        <SettingsNavItem icon={Globe} label="Cloud Sync" active={activeTab === 'Cloud Sync'} onClick={() => setActiveTab('Cloud Sync')} />
        <SettingsNavItem icon={Shield} label="Security & Privacy" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
        <SettingsNavItem icon={Database} label="System & Storage" active={activeTab === 'System Info'} onClick={() => setActiveTab('System Info')} />
        <div className="flex-1" />
        <SettingsNavItem icon={HelpCircle} label="About Kali Cloud" active={false} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl">
          {activeTab === 'Personalization' && (
            <>
              <h3 className="text-2xl font-bold mb-8 text-dragon-primary font-black uppercase tracking-tighter">Appearance</h3>
              <section className="mb-12">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Desktop Wallpaper</h4>
                <div className="grid grid-cols-3 gap-4">
                  {wallpapers.map(wp => (
                    <button 
                      key={wp.url}
                      onClick={() => setWallpaper(wp.url)}
                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${wallpaper === wp.url ? 'border-dragon-primary' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{wp.name}</span>
                      </div>
                      {wallpaper === wp.url && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-dragon-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">System Theme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-6 border-dragon-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold">Dark Mode</span>
                      <div className="w-10 h-5 bg-dragon-primary rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-black rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">The default enterprise theme for Dragon Core Omega.</p>
                  </div>
                  <div className="glass rounded-2xl p-6 opacity-40">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold">Light Mode</span>
                      <div className="w-10 h-5 bg-white/10 rounded-full relative">
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">High contrast mode for daylight operations.</p>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'Cloud Sync' && (
            <>
              <h3 className="text-2xl font-bold mb-8 text-dragon-primary font-black uppercase tracking-tighter">Cloud Integrations</h3>
              <section className="mb-12">
                <div className="glass rounded-3xl p-8 border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">
                        <Github className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">GitHub Development Sync</h4>
                        <p className="text-sm text-white/40 mt-1">Dynamically sync repositories with your Virtual File System.</p>
                      </div>
                    </div>
                    {!ghConnected ? (
                      <button 
                        onClick={connectGitHub}
                        className="px-6 py-3 bg-white text-black font-black rounded-xl hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <Link2 className="w-4 h-4" /> CONNECT
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-dragon-primary font-bold text-sm bg-dragon-primary/10 px-4 py-2 rounded-xl">
                        <Check className="w-4 h-4" /> CONNECTED
                      </div>
                    )}
                  </div>

                  {ghConnected && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-4 border-t border-white/5">
                        <div className="text-sm font-bold text-white/60">Auto-Sync Status</div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-dragon-primary font-mono animate-pulse">ACTIVE 2-WAY SYNC</span>
                          <button 
                            onClick={syncRepos}
                            className={`p-2 rounded-lg hover:bg-white/5 transition-all ${isSyncing ? 'animate-spin text-dragon-primary' : 'text-white/40'}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                        <div className="text-[10px] font-bold text-white/20 uppercase mb-3">Linked Repositories</div>
                        <div className="space-y-2">
                          <RepoRow name="dragon-core-omega" branch="main" />
                          <RepoRow name="security-exploits-educational" branch="dev" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeTab === 'System Info' && (
            <>
              <h3 className="text-2xl font-bold mb-8 text-dragon-primary font-black uppercase tracking-tighter">System Integrity</h3>
              <div className="glass rounded-2xl p-6 space-y-4">
                <InfoRow label="Edition" value="Kali Cloud Desktop OS Elite" />
                <InfoRow label="Version" value="16.0.0 (Dragon Core Omega)" />
                <InfoRow label="Build ID" value="f85cdaac-2462-46b2-a98a-c6c9cac7c79f" />
                <InfoRow label="Processor" value="Cloud Native Virtual Core" />
                <InfoRow label="Experience" value="Vercel Production Edge" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-white/10 text-white shadow-inner' : 'text-white/40 hover:bg-white/5 hover:text-white/60'}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

function RepoRow({ name, branch }: { name: string, branch: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-dragon-primary/30 transition-all">
      <div className="flex items-center gap-3">
        <Github className="w-4 h-4 text-white/40" />
        <span className="text-sm font-bold text-white/80">{name}</span>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/40 text-[10px] font-mono text-white/40">
        <GitBranch className="w-3 h-3" /> {branch}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/40">{label}</span>
      <span className="text-sm font-mono text-white/80">{value}</span>
    </div>
  );
}
