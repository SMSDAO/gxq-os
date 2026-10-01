import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: '"JetBrains Mono", monospace',
      theme: {
        background: 'transparent',
        foreground: '#00FF88',
        cursor: '#00FF88',
        selectionBackground: 'rgba(0, 255, 136, 0.3)',
      },
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    term.writeln('\x1b[1;32mKALI CLOUD DESKTOP OS ELITE [Version 16.0.0]\x1b[0m');
    term.writeln('\x1b[1;36mDRAGON CORE OMEGA // SECURE_SHELL_ENABLED\x1b[0m');
    term.writeln('');
    term.write('\x1b[1;32mroot@kali-elite\x1b[0m:\x1b[1;34m~\x1b[0m# ');

    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) {
        term.writeln('');
        term.write('\x1b[1;32mroot@kali-elite\x1b[0m:\x1b[1;34m~\x1b[0m# ');
      } else if (domEvent.keyCode === 8) {
        if (term.buffer.active.cursorX > 18) {
          term.write('\b \b');
        }
      } else if (printable) {
        term.write(key);
      }
    });

    xtermRef.current = term;

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      term.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full bg-black/60 p-4">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
}
