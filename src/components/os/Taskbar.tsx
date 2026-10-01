import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/osStore';
import { 
  Terminal as TerminalIcon, 
  Folder, 
  Code2, 
  ShieldAlert, 
  Cpu, 
  Settings as SettingsIcon,
  Search,
  Power,
  Wifi,
  Battery,
  ChevronUp,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const apps = [
  { id: 'terminal', title: 'Terminal', icon: '/src/assets/images/terminal_icon_1790871993660.jpg', lucide: TerminalIcon, color: 'text-emerald-400' },
  { id: 'files', title: 'Files', icon: '/src/assets/images/file_manager_icon_1790872006634.jpg', lucide: Folder, color: 'text-cyan-400' },
  { id: 'studio', title: 'Code Studio', icon: '/src/assets/images/code_studio_icon_1790872021151.jpg', lucide: Code2, color: 'text-purple-400' },
  { id: 'security', title: 'Security Lab', icon: '/src/assets/images/security_lab_icon_1790872032313.jpg', lucide: ShieldAlert, color: 'text-red-400' },
  { id: 'ai', title: 'AI Copilot', icon: null, lucide: Cpu, color: 'text-yellow-400' },
  { id: 'settings', title: 'Settings', icon: null, lucide: SettingsIcon, color: 'text-slate-400' },
  { id: 'admin', title: 'Admin Center', icon: null, lucide: Shield, color: 'text-dragon-primary' },
];

export function Taskbar() {
  const { openWindow, windows, activeWindowId, focusWindow } = useOSStore();
  const [showStart, setShowStart] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 glass z-[9999] flex items-center justify-between px-4">
      {/* Left side: Start Menu & Search */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setShowStart(!showStart)}
          className={cn(
            "p-2 rounded-lg transition-all hover:bg-white/10 active:scale-95",
            showStart && "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          )}
        >
          <div className="w-6 h-6 rounded bg-gradient-to-br from-dragon-primary to-dragon-secondary flex items-center justify-center p-1">
            <div className="w-full h-full border-2 border-white/30 rounded-sm" />
          </div>
        </button>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-dragon-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search apps, files, security..."
            className="h-9 w-64 glass rounded-lg pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-dragon-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Center: Running Apps */}
      <div className="flex items-center gap-1">
        {windows.map(win => (
          <button
            key={win.id}
            onClick={() => focusWindow(win.id)}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-white/10 relative group",
              activeWindowId === win.id && "bg-white/20"
            )}
          >
            {win.icon ? (
              <img src={win.icon} alt={win.title} className="w-7 h-7 rounded" />
            ) : (
              <div className="w-7 h-7 bg-white/10 rounded flex items-center justify-center">
                <span className="text-[10px] font-bold uppercase">{win.title[0]}</span>
              </div>
            )}
            <div className={cn(
              "absolute -bottom-1 w-1 h-1 bg-dragon-primary rounded-full transition-all scale-0",
              activeWindowId === win.id && "scale-100"
            )} />
            
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              {win.title}
            </div>
          </button>
        ))}
      </div>

      {/* Right side: System Tray */}
      <div className="flex items-center gap-4 text-xs font-medium text-white/60">
        <div className="flex items-center gap-3">
          <ChevronUp className="w-4 h-4 cursor-pointer hover:text-white" />
          <Wifi className="w-4 h-4 cursor-pointer hover:text-white" />
          <Battery className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>
        <div className="text-right cursor-default select-none">
          <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-[10px] opacity-60">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
        </div>
        <div className="w-1 h-8 bg-white/10 rounded-full mx-1" />
        <button className="hover:text-red-400 transition-colors">
          <Power className="w-4 h-4" />
        </button>
      </div>

      {/* Start Menu Overlay */}
      <AnimatePresence>
        {showStart && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 left-4 w-96 glass rounded-2xl p-6 shadow-2xl z-[10000]"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold text-white/80">Pinned Apps</span>
              <button className="text-xs text-dragon-primary hover:underline">All Apps</button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {apps.map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    openWindow(app.id, app.title, app.icon || '', app.id);
                    setShowStart(false);
                  }}
                  className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className={cn("p-2 rounded-xl glass transition-all group-hover:scale-110 group-active:scale-90", app.color)}>
                    <app.lucide className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-medium text-white/60 group-hover:text-white">{app.title}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-dragon-primary to-dragon-accent p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold">JD</div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">John Doe</div>
                  <div className="text-[10px] text-white/40">Enterprise Admin</div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                <Power className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
