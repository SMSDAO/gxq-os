import React, { useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { 
  FileCode, 
  Save, 
  Play, 
  Terminal as TerminalIcon, 
  FolderTree, 
  Settings as SettingsIcon,
  ChevronRight,
  GitBranch,
  Search,
  Bot,
  Send,
  Sparkles,
  X,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { PromptEngine, PromptContext } from '../../lib/ai/promptEngine';
import { useAuth } from '../../hooks/useAuth';
import { useOSStore } from '../../store/osStore';

// Configure Monaco to load from a reliable CDN
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
  }
});

export function CodeStudio() {
  const { profile } = useAuth();
  const { activeWindowId, windows } = useOSStore();
  const [code, setCode] = useState(`/**
 * KALI CLOUD OS - Dragon Core Omega
 * Kernel Service V16.0.0
 */

#include <dragon_core.h>

void main() {
    printf("Initializing Enterprise Security Layer...\\n");
    
    if (security_check() == OK) {
        init_virtual_workspace();
    }
    
    start_cloud_os();
}
`);
  const [showAI, setShowAI] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSend = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    const msg = aiInput;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsAiLoading(true);

    const context: PromptContext = {
      user: {
        displayName: profile?.displayName || 'Developer',
        email: profile?.email || null,
        role: profile?.role || 'USER',
        orgName: 'Enterprise Cluster'
      },
      activeWindow: { id: 'studio', title: 'Code Studio' },
      systemStatus: {
        memoryUsage: '2.4GB',
        diskSpace: '80GB',
        uptime: '1h 45m'
      },
      knowledgeBase: `Current File: kernel_v16.c\nContent:\n${code}`
    };

    const prompt = PromptEngine.buildPrompt(msg, context, 'CODE_ASSISTANT');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: 'Neuron link failure. Retrying...' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
      {/* Menu Bar */}
      <div className="h-9 border-b border-white/5 flex items-center justify-between px-3 bg-black/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-[11px] font-medium text-white/40">
            <span className="hover:text-white cursor-pointer transition-colors">File</span>
            <span className="hover:text-white cursor-pointer transition-colors">Edit</span>
            <span className="hover:text-white cursor-pointer transition-colors">Selection</span>
            <span className="hover:text-white cursor-pointer transition-colors">View</span>
            <span className="hover:text-white cursor-pointer transition-colors">Go</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-2 px-3 py-1 bg-dragon-primary/10 hover:bg-dragon-primary/20 text-dragon-primary text-[10px] font-bold rounded transition-all">
            <Play className="w-3 h-3" /> RUN
          </button>
          <button className="p-1.5 hover:bg-white/5 rounded text-white/40"><Save className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 flex flex-col items-center gap-4 py-4 border-r border-white/5 bg-black/20">
          <FolderTree className="w-5 h-5 text-white/60 hover:text-white cursor-pointer transition-colors" />
          <Search className="w-5 h-5 text-white/20 hover:text-white cursor-pointer transition-colors" />
          <GitBranch className="w-5 h-5 text-white/20 hover:text-white cursor-pointer transition-colors" />
          <div className="flex-1" />
          <SettingsIcon className="w-5 h-5 text-white/20 hover:text-white cursor-pointer transition-colors mb-4" />
        </div>

        {/* Sidebar (Explorer) */}
        <div className="w-60 border-r border-white/5 bg-black/10 flex flex-col">
          <div className="p-3 text-[10px] font-bold text-white/20 uppercase tracking-widest">Explorer</div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-1 px-3 py-1 hover:bg-white/5 cursor-pointer group">
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40" />
              <span className="text-xs text-white/60 group-hover:text-white">dragon_core_omega</span>
            </div>
            <div className="pl-6 space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-1 bg-dragon-primary/10 border-l border-dragon-primary cursor-pointer">
                <FileCode className="w-3.5 h-3.5 text-dragon-primary" />
                <span className="text-xs text-dragon-primary font-medium">kernel_v16.c</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 hover:bg-white/5 cursor-pointer">
                <FileCode className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/60">dragon_os.h</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 hover:bg-white/5 cursor-pointer">
                <FileCode className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs text-white/60">security_layer.cpp</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-9 bg-black/20 flex items-center justify-between border-b border-white/5 pr-2">
            <div className="flex overflow-x-auto">
              <div className="flex items-center gap-2 px-4 border-r border-white/5 bg-white/5 border-t-2 border-t-dragon-primary cursor-default">
                <FileCode className="w-3 h-3 text-dragon-primary" />
                <span className="text-xs font-medium text-white/80">kernel_v16.c</span>
              </div>
            </div>
            <button 
              onClick={() => setShowAI(!showAI)}
              className={`p-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold transition-all ${showAI ? 'bg-dragon-primary text-black' : 'text-white/40 hover:bg-white/5'}`}
            >
              <Bot className="w-3.5 h-3.5" /> {showAI ? 'HIDE ASSISTANT' : 'AI ASSISTANT'}
            </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: '"JetBrains Mono", monospace',
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  readOnly: false,
                  padding: { top: 20 },
                  lineHeight: 1.6
                }}
              />
            </div>
            
            {showAI && (
              <div className="w-80 border-l border-white/5 bg-black/40 flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-dragon-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Code Assistant</span>
                  </div>
                  <X className="w-4 h-4 text-white/20 cursor-pointer hover:text-white" onClick={() => setShowAI(false)} />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {aiMessages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-xl text-[11px] leading-relaxed ${m.role === 'assistant' ? 'bg-white/5 text-white/80 border border-white/5' : 'bg-dragon-primary/10 text-dragon-primary border border-dragon-primary/20'}`}>
                      {m.content}
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex items-center gap-2 text-[10px] text-white/40 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Analyzing kernel...
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-white/5">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
                      placeholder="Refactor current block..."
                      className="w-full h-10 bg-white/5 rounded-lg pl-4 pr-10 text-[11px] outline-none focus:ring-1 focus:ring-dragon-primary/50"
                    />
                    <button onClick={handleAiSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-dragon-primary">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-dragon-primary flex items-center justify-between px-3 text-[10px] text-black font-bold">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:bg-black/10 px-2 h-full cursor-pointer">
            <GitBranch className="w-3 h-3" /> main*
          </div>
          <div className="flex items-center gap-1">
            <TerminalIcon className="w-3 h-3" /> 0 Errors, 0 Warnings
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 12, Col 42</span>
          <span>UTF-8</span>
          <span>C++</span>
        </div>
      </div>
    </div>
  );
}
