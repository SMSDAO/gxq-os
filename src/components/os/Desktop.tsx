import React from 'react';
import { Taskbar } from './Taskbar';
import { WindowManager } from './WindowManager';
import { useOSStore } from '../../store/osStore';
import { motion } from 'motion/react';

export function Desktop() {
  const { wallpaper, openWindow } = useOSStore();

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Desktop Grid Icons */}
      <div className="p-6 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 w-fit h-full">
        <DesktopIcon 
          id="terminal" 
          title="Terminal" 
          icon="/src/assets/images/terminal_icon_1790871993660.jpg" 
          onOpen={() => openWindow('terminal', 'Terminal', '/src/assets/images/terminal_icon_1790871993660.jpg', 'terminal')} 
        />
        <DesktopIcon 
          id="files" 
          title="File Manager" 
          icon="/src/assets/images/file_manager_icon_1790872006634.jpg" 
          onOpen={() => openWindow('files', 'File Manager', '/src/assets/images/file_manager_icon_1790872006634.jpg', 'files')} 
        />
        <DesktopIcon 
          id="security" 
          title="Security Lab" 
          icon="/src/assets/images/security_lab_icon_1790872032313.jpg" 
          onOpen={() => openWindow('security', 'Security Lab', '/src/assets/images/security_lab_icon_1790872032313.jpg', 'security')} 
        />
        <DesktopIcon 
          id="studio" 
          title="Code Studio" 
          icon="/src/assets/images/code_studio_icon_1790872021151.jpg" 
          onOpen={() => openWindow('studio', 'Code Studio', '/src/assets/images/code_studio_icon_1790872021151.jpg', 'studio')} 
        />
      </div>

      {/* Main OS Layers */}
      <WindowManager />
      <Taskbar />
      
      {/* Background Ambient Dragon Glow */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-dragon-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-dragon-secondary/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}

function DesktopIcon({ id, title, icon, onOpen }: { id: string, title: string, icon: string, onOpen: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
      whileTap={{ scale: 0.95 }}
      onDoubleClick={onOpen}
      className="w-20 h-24 flex flex-col items-center gap-1 p-2 rounded-xl transition-all group"
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg glass p-1 group-hover:neon-glow-emerald">
        <img src={icon} alt={title} className="w-full h-full object-cover rounded-lg" />
      </div>
      <span className="text-[10px] text-white font-medium text-center drop-shadow-md leading-tight line-clamp-2">
        {title}
      </span>
    </motion.button>
  );
}
