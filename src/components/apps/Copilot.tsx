import React, { useState } from 'react';
import { Cpu, Send, Sparkles, History, Bot, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

import { PromptEngine, PromptContext } from '../../lib/ai/promptEngine';
import { useAuth } from '../../hooks/useAuth';
import { useOSStore } from '../../store/osStore';

export function Copilot() {
  const { profile } = useAuth();
  const { activeWindowId, windows } = useOSStore();
  const activeWin = windows.find(w => w.id === activeWindowId);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to Dragon Core AI Copilot. How can I assist your cloud operations today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const context: PromptContext = {
      user: {
        displayName: profile?.displayName || 'Operative',
        email: profile?.email || null,
        role: profile?.role || 'USER',
        orgName: 'Acme Corp' // Placeholder for real org data
      },
      activeWindow: activeWin ? { id: activeWin.id as any, title: activeWin.title } : undefined,
      systemStatus: {
        memoryUsage: '1.2GB / 16GB',
        diskSpace: '45GB / 100GB',
        uptime: '4h 12m'
      }
    };

    const prompt = PromptEngine.buildPrompt(userMsg, context);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          // systemInstruction is now part of the prompt built by engine
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Failed to connect to Dragon Core AI neurons.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#020617]">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-sm font-bold">DRAGON CO-PILOT</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-dragon-primary animate-pulse" />
              <span className="text-[10px] text-dragon-primary font-bold tracking-widest uppercase">Active Neuron</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-white/40"><History className="w-4 h-4" /></button>
          <button onClick={() => setMessages([])} className="p-2 hover:bg-red-500/10 rounded-lg text-white/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
              msg.role === 'assistant' ? "bg-dragon-primary/10 border border-dragon-primary/20" : "bg-white/10"
            )}>
              {msg.role === 'assistant' ? <Bot className="w-5 h-5 text-dragon-primary" /> : <User className="w-5 h-5 text-white/60" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'assistant' ? "glass border-dragon-primary/10" : "bg-white/5 border border-white/10"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4 items-center text-white/40 text-xs animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            Generating response...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything to the OS Copilot..."
            className="w-full h-14 glass rounded-2xl pl-6 pr-16 text-sm outline-none focus:ring-1 focus:ring-dragon-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-dragon-primary text-black flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
