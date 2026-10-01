import { create } from 'zustand';
import { OSState, OSWindow } from '../types/os';

interface OSStore extends OSState {
  openWindow: (appId: string, title: string, icon: string, component: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
  setWallpaper: (url: string) => void;
}

export const useOSStore = create<OSStore>((set) => ({
  windows: [],
  activeWindowId: null,
  wallpaper: '/src/assets/images/dragon_core_wallpaper_1790871978331.jpg',
  theme: 'dark',

  openWindow: (id, title, icon, component) => set((state) => {
    const existing = state.windows.find(w => w.id === id);
    if (existing) {
      return { activeWindowId: id, windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: false } : w) };
    }
    const newWindow: OSWindow = {
      id, title, icon, component,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: state.windows.length + 10,
      x: 100 + state.windows.length * 40,
      y: 100 + state.windows.length * 40,
      width: 800,
      height: 600
    };
    return {
      windows: [...state.windows, newWindow],
      activeWindowId: id
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? (state.windows.length > 1 ? state.windows[state.windows.length - 2].id : null) : state.activeWindowId
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
  })),

  focusWindow: (id) => set((state) => {
    const maxZ = Math.max(0, ...state.windows.map(w => w.zIndex));
    return {
      activeWindowId: id,
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w)
    };
  }),

  updateWindowPosition: (id, x, y) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, x, y } : w)
  })),

  updateWindowSize: (id, width, height) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, width, height } : w)
  })),

  setWallpaper: (wallpaper) => set({ wallpaper })
}));
