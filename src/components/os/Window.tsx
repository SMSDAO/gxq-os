import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls } from 'motion/react';
import { X, Minus, Square, Copy } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { OSWindow } from '../../types/os';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WindowProps {
  window: OSWindow;
  children: React.ReactNode;
}

export function Window({ window, children }: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, activeWindowId } = useOSStore();
  const controls = useDragControls();
  const windowRef = useRef<HTMLDivElement>(null);
  const isActive = activeWindowId === window.id;

  if (window.isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      initial={false}
      animate={{
        width: window.isMaximized ? '100vw' : window.width,
        height: window.isMaximized ? 'calc(100vh - 56px)' : window.height,
        x: window.isMaximized ? 0 : window.x,
        y: window.isMaximized ? 0 : window.y,
        scale: 1,
        opacity: 1,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      drag={!window.isMaximized}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        updateWindowPosition(window.id, window.x + info.offset.x, window.y + info.offset.y);
      }}
      onPointerDown={() => focusWindow(window.id)}
      style={{ zIndex: window.zIndex }}
      className={cn(
        "fixed glass rounded-xl overflow-hidden flex flex-col shadow-2xl",
        isActive ? "border-white/20 shadow-dragon-primary/10" : "border-white/5 opacity-80",
        window.isMaximized && "rounded-none"
      )}
    >
      {/* Window Header */}
      <div 
        className={cn(
          "h-10 flex items-center justify-between px-3 select-none cursor-default",
          isActive ? "bg-white/5" : "bg-transparent"
        )}
        onPointerDown={(e) => controls.start(e)}
      >
        <div className="flex items-center gap-2">
          {window.icon && <img src={window.icon} alt="" className="w-4 h-4" />}
          <span className="text-xs font-medium text-white/80">{window.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
          >
            {window.isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden bg-black/20">
        {children}
      </div>
    </motion.div>
  );
}
