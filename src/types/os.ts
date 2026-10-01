export interface OSWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  component: string;
}

export interface OSState {
  windows: OSWindow[];
  activeWindowId: string | null;
  wallpaper: string;
  theme: 'dark' | 'light';
}

export type AppID = 'terminal' | 'files' | 'studio' | 'security' | 'ai' | 'settings' | 'portfolio' | 'wallet';
