import React, { useState, useEffect, useRef } from 'react';
import { Database, Layout, Smartphone, Monitor, Code, Play, RefreshCw, Terminal } from 'lucide-react';

interface LivePreviewProps {
  compiledCode: string;
  onClose: () => void;
  siteName: string;
}

export default function LivePreview({ compiledCode, onClose, siteName }: LivePreviewProps) {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['No operations logged yet. Submit forms or authenticate in the preview to capture sandbox telemetry.']);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync log listener from the iframe
  useEffect(() => {
    const handleLogs = (e: MessageEvent) => {
      // Look for custom logged events inside iframe
      if (e.data && e.data.type === 'WEBCRAFT_SANDBOX_EVENT') {
        setConsoleLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${e.data.message}`
        ]);
      }
    };
    window.addEventListener('message', handleLogs);
    return () => window.removeEventListener('message', handleLogs);
  }, []);

  const injectConsoleTriggerToCode = (): string => {
    // Add custom window overrides so console logs in the compiled JS bubble up to our main console tracker!
    const hookScript = `
    <script>
      // Override alert to output to custom console
      const originalAlert = window.alert;
      window.alert = function(msg) {
        window.parent.postMessage({
          type: 'WEBCRAFT_SANDBOX_EVENT',
          message: '🔔 ALERT TRIGGERED: ' + msg
        }, '*');
        originalAlert(msg);
      };

      // Override console.log
      const originalLog = console.log;
      console.log = function(...args) {
        window.parent.postMessage({
          type: 'WEBCRAFT_SANDBOX_EVENT',
          message: '💻 console.log: ' + args.join(' ')
        }, '*');
        originalLog(...args);
      };

      // Intercept our simulated logs
      const originalSim = window.simulatedLogSubmission;
      window.simulatedLogSubmission = function(collect, data) {
        window.parent.postMessage({
          type: 'WEBCRAFT_SANDBOX_EVENT',
          message: '❇️ DB WRITE (Sandbox): Added doc to collection [' + collect + '] -> ' + JSON.stringify(data)
        }, '*');
        originalAlert("❇ Submission simulated in local logs. Active row added! Check telemetry console next to iframe.");
      };
    </script>
    `;
    
    // Inject just before closure of head
    return compiledCode.replace('</head>', `${hookScript}\n</head>`);
  };

  const reloadPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = injectConsoleTriggerToCode();
      setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔄 Preview Sandbox Reloaded...`]);
    }
  };

  return (
    <div id="live-preview-fullscreen" className="fixed inset-0 bg-slate-900 border border-slate-700 text-slate-100 z-50 flex flex-col font-sans">
      
      {/* Control Top Bar */}
      <header id="preview-top-bar" className="bg-slate-950 border-b border-slate-800 py-3.5 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center space-x-3">
          <span className="p-1 px-2.5 bg-indigo-950 text-indigo-400 rounded-lg text-xs font-mono font-bold">
            PREVIEW MODE
          </span>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">{siteName}</h1>
            <p className="text-[10px] text-slate-400 font-mono">Simulating physical client behaviors</p>
          </div>
        </div>

        {/* Viewport Toggles */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            id="toggle-desktop-view"
            onClick={() => setViewport('desktop')}
            className={`p-2 rounded-md transition ${viewport === 'desktop' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            title="Desktop View (100% Fluid)"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            id="toggle-mobile-view"
            onClick={() => setViewport('mobile')}
            className={`p-2 rounded-md transition ${viewport === 'mobile' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white'}`}
            title="Responsive Mobile Wrap"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="btn-reload-sandbox"
            onClick={reloadPreview}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white rounded-lg transition border border-slate-800 cursor-pointer"
            title="Reload Frame Stack"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            id="btn-close-preview"
            onClick={onClose}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            Back to Editor
          </button>
        </div>
      </header>

      {/* Main Sandbox split display */}
      <div id="preview-sandbox-grid" className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Frame Stage */}
        <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto">
          <div
            id="preview-frame-wrapper"
            className={`h-full bg-white transition-all duration-300 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden ${
              viewport === 'desktop' ? 'w-full max-w-6xl' : 'w-[375px]'
            }`}
          >
            <iframe
              id="sandbox-iframe"
              ref={iframeRef}
              srcDoc={injectConsoleTriggerToCode()}
              className="w-full h-full border-0 select-text bg-white"
              title="Compiled Webcraft Instance"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>

        {/* Right Side: Simulated Database Stream */}
        <div id="preview-logs-panel" className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/80">
            <span className="text-xs font-mono font-bold tracking-tight text-indigo-400 flex items-center gap-1.5 uppercase">
              <Terminal className="h-4 w-4" /> Telemetry Console
            </span>
            <button
              id="btn-clear-telemetry"
              onClick={() => setConsoleLogs([])}
              className="text-[9px] font-mono text-slate-500 hover:text-slate-300 uppercase px-2 py-0.5 rounded border border-slate-800 hover:bg-slate-900"
            >
              Clear
            </button>
          </div>

          <div id="telemetry-logs-list" className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-[10px] text-slate-300 leading-relaxed bg-slate-950/40">
            {consoleLogs.map((log, index) => {
              const isAlert = log.includes('alert') || log.includes('🔔');
              const isDb = log.includes('DB WRITE') || log.includes('❇️');
              let borderCol = 'border-slate-800 bg-slate-900/30';
              let badge = 'LOG';
              let badgeCol = 'bg-slate-800 text-slate-400';

              if (isAlert) {
                borderCol = 'border-amber-900 bg-amber-950/10 text-amber-300';
                badge = 'ALERT';
                badgeCol = 'bg-amber-900/40 text-amber-400';
              } else if (isDb) {
                borderCol = 'border-emerald-900 bg-emerald-950/10 text-emerald-300';
                badge = 'STORE';
                badgeCol = 'bg-emerald-900/40 text-emerald-400';
              }

              return (
                <div key={index} className={`p-3 rounded-lg border leading-normal ${borderCol}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[8px] tracking-wider uppercase ${badgeCol}`}>
                      {badge}
                    </span>
                    <span className="text-[8px] text-slate-500">Sandbox Telemetry</span>
                  </div>
                  <div className="break-all whitespace-pre-wrap">{log}</div>
                </div>
              );
            })}
          </div>

          {/* Guidelines notes */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 text-[10px] text-slate-500 leading-relaxed font-mono">
            💡 Submit any registration form inside the site! Your visual client-bindings inject docs synchronously into the logs.
          </div>
        </div>

      </div>

    </div>
  );
}
