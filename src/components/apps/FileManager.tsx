import React, { useState } from 'react';
import { 
  Folder, 
  File, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Home, 
  Clock, 
  Star, 
  Download, 
  MoreVertical,
  Plus
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const mockFiles = [
  { id: '1', name: 'system_core', type: 'folder', size: '2.4 GB', date: 'Oct 01, 2026' },
  { id: '2', name: 'user_vault', type: 'folder', size: '1.2 GB', date: 'Oct 01, 2026' },
  { id: '3', name: 'security_audit.log', type: 'file', size: '42 KB', date: 'Oct 01, 2026' },
  { id: '4', name: 'dragon_omega.iso', type: 'file', size: '4.8 GB', date: 'Sep 28, 2026' },
  { id: '5', name: 'kernel_v16.c', type: 'file', size: '128 KB', date: 'Sep 30, 2026' },
];

export function FileManager() {
  const [path, setPath] = useState(['Home']);
  
  return (
    <div className="w-full h-full flex flex-col bg-[#020617] text-white">
      {/* Navigation Bar */}
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/40"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1 text-xs text-white/60">
            {path.map((p, i) => (
              <React.Fragment key={p}>
                {i > 0 && <ChevronRight className="w-3 h-3 text-white/20" />}
                <span className="hover:text-white cursor-pointer">{p}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search files..."
            className="h-8 w-48 glass rounded-lg pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-dragon-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-white/5 bg-black/10 p-4 flex flex-col gap-1">
          <SidebarItem icon={Home} label="Quick Access" active />
          <SidebarItem icon={Clock} label="Recent" />
          <SidebarItem icon={Star} label="Favorites" />
          <SidebarItem icon={Download} label="Downloads" />
          
          <div className="mt-8 mb-2 px-3 text-[10px] font-bold text-white/20 uppercase">Storage</div>
          <div className="px-3">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[65%] bg-dragon-primary" />
            </div>
            <div className="text-[10px] text-white/40">65% of 1.0 TB used</div>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-black/40 backdrop-blur-md border-b border-white/5 z-10">
              <tr className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Date Modified</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {mockFiles.map(file => (
                <tr key={file.id} className="group hover:bg-white/5 transition-colors cursor-default">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <Folder className="w-5 h-5 text-dragon-secondary fill-dragon-secondary/20" />
                      ) : (
                        <File className="w-5 h-5 text-white/40" />
                      )}
                      <span className="text-white/80 group-hover:text-white transition-colors">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-white/40">{file.date}</td>
                  <td className="px-6 py-3 text-white/40">{file.size}</td>
                  <td className="px-6 py-3 text-right">
                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all">
                      <MoreVertical className="w-4 h-4 text-white/40" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty state action */}
          <div className="p-8 flex items-center justify-center">
            <button className="flex items-center gap-2 px-4 py-2 border border-dashed border-white/10 rounded-xl text-white/20 hover:text-white/40 hover:border-white/20 transition-all text-xs">
              <Plus className="w-4 h-4" />
              Drop files here or click to upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all",
      active ? "bg-dragon-primary/10 text-dragon-primary" : "text-white/40 hover:bg-white/5 hover:text-white/60"
    )}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
