import React, { lazy, Suspense } from 'react';
import { useOSStore } from '../../store/osStore';
import { Window } from './Window';
import { Loader2 } from 'lucide-react';

const Terminal = lazy(() => import('../apps/Terminal').then(m => ({ default: m.Terminal })));
const FileManager = lazy(() => import('../apps/FileManager').then(m => ({ default: m.FileManager })));
const CodeStudio = lazy(() => import('../apps/CodeStudio').then(m => ({ default: m.CodeStudio })));
const SecurityLab = lazy(() => import('../apps/SecurityLab').then(m => ({ default: m.SecurityLab })));
const Copilot = lazy(() => import('../apps/Copilot').then(m => ({ default: m.Copilot })));
const Settings = lazy(() => import('../apps/Settings').then(m => ({ default: m.Settings })));
const AdminCenter = lazy(() => import('../apps/AdminCenter').then(m => ({ default: m.AdminCenter })));

const appComponents: Record<string, React.ReactNode> = {
  terminal: <Terminal />,
  files: <FileManager />,
  studio: <CodeStudio />,
  security: <SecurityLab />,
  ai: <Copilot />,
  settings: <Settings />,
  admin: <AdminCenter />,
};

export function WindowManager() {
  const { windows } = useOSStore();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {windows.map((win) => (
        <div key={win.id} className="pointer-events-auto">
          <Window window={win}>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-black/40">
                <Loader2 className="w-8 h-8 animate-spin text-dragon-primary" />
              </div>
            }>
              {appComponents[win.component] || <div className="p-4">App component not found: {win.component}</div>}
            </Suspense>
          </Window>
        </div>
      ))}
    </div>
  );
}
