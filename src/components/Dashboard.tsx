import React, { useState, useEffect } from 'react';
import { DEFAULT_TEMPLATES } from '../templates';
import { Website } from '../types';
import { LayoutGrid, Plus, FileText, ChevronRight, Trash2, Calendar, Database, Eye } from 'lucide-react';

interface DashboardProps {
  onSelectSite: (site: Website) => void;
}

export default function Dashboard({ onSelectSite }: DashboardProps) {
  const [savedSites, setSavedSites] = useState<Website[]>([]);

  useEffect(() => {
    const listJson = localStorage.getItem('webcraft_saved_sites');
    if (listJson) {
      try {
        setSavedSites(JSON.parse(listJson));
      } catch (err) {
        console.error('Error parsing saved sites', err);
      }
    }
  }, []);

  const handleCreateNew = () => {
    const newSite: Website = {
      id: `site-${Date.now()}`,
      name: 'Untitled Website',
      description: 'A custom web application built with drag-and-drop elements.',
      elements: [
        {
          id: 'hdr',
          type: 'header',
          props: {
            logoText: '✦ My Brand',
            links: [{ label: 'Home', href: '#' }],
            style: { bgColor: 'bg-slate-900', textColor: 'text-white', paddingY: 'py-4', paddingX: 'px-6' }
          }
        },
        {
          id: 'hr',
          type: 'hero',
          props: {
            title: 'Welcome to Your Brand New Website',
            subtitle: 'Click on any element in the canvas below to edit its content and styles. Add forms, buttons, or conditional authentication blocks in seconds.',
            buttonText: 'Explore More',
            buttonLink: '#',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
            style: { bgColor: 'bg-white', textColor: 'text-slate-800', paddingY: 'py-16', paddingX: 'px-6', alignment: 'center' }
          }
        },
        {
          id: 'ftr',
          type: 'footer',
          props: {
            copyright: '© 2026 My Brand. All rights reserved.',
            style: { bgColor: 'bg-slate-900', textColor: 'text-slate-400', paddingY: 'py-6', paddingX: 'px-6', alignment: 'center' }
          }
        }
      ],
      integration: {
        provider: 'none'
      },
      createdAt: new Date().toISOString()
    };

    onSelectSite(newSite);
  };

  const handleSelectTemplate = (template: Website) => {
    // Clone template so they are editing an isolated version
    const cloned: Website = {
      ...template,
      id: `site-${Date.now()}`,
      name: `${template.name} (${new Date().toLocaleDateString()})`,
      createdAt: new Date().toISOString()
    };
    onSelectSite(cloned);
  };

  const handleDeleteSite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSites.filter(s => s.id !== id);
    setSavedSites(updated);
    localStorage.setItem('webcraft_saved_sites', JSON.stringify(updated));
  };

  return (
    <div id="dashboard-root" className="min-h-screen bg-[#0A0A0C] text-slate-300 font-sans">
      {/* Header Bar */}
      <header id="dashboard-header" className="bg-[#0F0F12] border-b border-slate-800 sticky top-0 z-10 py-4 px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">W</span>
              <span>WebCraft <span className="text-[10px] bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded font-mono font-bold uppercase ml-1">OpenWix Sandbox</span></span>
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Authoritative No-Code Workspace
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="dashboard-main" className="max-w-7xl mx-auto py-12 px-6">
        
        {/* Welcome Block */}
        <div id="welcome-message-card" className="mb-12 bg-[#0F0F12] rounded-2xl border border-slate-800 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome to WebCraft Builder
            </h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              An open-source, vendor-locking-free alternative to closed website hosters. Drag-and-drop beautiful, responsive visual blocks, map inputs to <strong className="text-indigo-400">Supabase</strong> or <strong className="text-emerald-400 font-bold">Firestore</strong> tables with zero backend requirements, and compile directly to clean standalone HTML code.
            </p>
          </div>
          <button
            id="btn-create-blank"
            onClick={handleCreateNew}
            className="w-full md:w-auto h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition shadow-sm hover:shadow active:scale-95 duration-150 cursor-pointer text-sm shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span>Create Blank Website</span>
          </button>
        </div>

        {/* Section 1: Pre-built Production Patterns */}
        <div id="templates-section" className="mb-14">
          <h2 className="text-lg font-bold tracking-tight text-white mb-6 flex items-center gap-2">
            <span className="inline-block py-1 px-3 bg-indigo-950/80 text-indigo-400 border border-indigo-900/40 rounded-md font-mono text-xs font-semibold">Step 1</span>
            <span>Deploy From Modern Presets</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEFAULT_TEMPLATES.map((tpl) => (
              <div
                id={`template-card-${tpl.id}`}
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="group relative bg-[#0F0F12] border border-slate-800 hover:border-indigo-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">
                      {tpl.id === 'saas-landing' ? 'SaaS Launch' : tpl.id === 'portfolio-clean' ? 'Creative Port' : 'Service Industry'}
                    </span>
                    <span className="text-[10px] font-mono bg-slate-900 border border-slate-850 px-2 py-0.5 text-slate-400 rounded">
                      Preset Template
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                    {tpl.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-slate-300 font-medium text-xs">
                  <span className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                    <Database className="h-4 w-4 text-indigo-500" /> Binding Ready
                  </span>
                  <span className="text-indigo-400 flex items-center group-hover:translate-x-1 transition duration-150 font-bold text-[11px]">
                    Load Visual Preset <ChevronRight className="h-4 w-4 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Saved Websites */}
        <div id="saved-websites-section">
          <h2 className="text-lg font-bold tracking-tight text-white mb-6 flex items-center gap-2">
            <span className="inline-block py-1 px-3 bg-emerald-950/80 text-emerald-400 border border-emerald-900/40 rounded-md font-mono text-xs font-semibold">Saved Work</span>
            <span>Your Visual Creations Workspace</span>
          </h2>

          {savedSites.length === 0 ? (
            <div id="no-websites-fallback" className="bg-[#0F0F12] border-2 border-dashed border-slate-850 rounded-2xl p-16 text-center shadow-inner">
              <FileText className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold text-sm mb-1">No custom websites saved in the workspace yet.</p>
              <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">Get started by selecting one of our high-fidelity templates above or starting a completely blank canvas.</p>
              <button
                id="btn-fallback-create"
                onClick={handleCreateNew}
                className="inline-flex h-11 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl items-center gap-2 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Start Empty Canvas</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSites.map((site) => (
                <div
                  id={`saved-site-card-${site.id}`}
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  className="bg-[#0F0F12] border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 shadow-sm hover:shadow hover:scale-[1.005] cursor-pointer transition flex items-center justify-between"
                >
                  <div className="space-y-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white truncate text-base">
                        {site.name}
                      </h3>
                      {site.integration.provider !== 'none' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 capitalize">
                          🔌 {site.integration.provider === 'firebase' ? 'Firestore' : 'Supabase'}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs truncate">
                      {site.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Updated {new Date(site.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-indigo-400">
                        <Eye className="h-3 w-3" /> {site.elements.length} components
                      </span>
                    </div>
                  </div>

                  <button
                    id={`btn-delete-site-${site.id}`}
                    onClick={(e) => handleDeleteSite(site.id, e)}
                    className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition border border-transparent hover:border-rose-900/30 duration-150 shrink-0"
                    title="Delete website permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Bottom Status Bar Ribbon */}
      <footer className="h-9 bg-indigo-600 px-6 flex items-center justify-between text-[10px] text-white font-mono font-bold">
        <div className="flex gap-4">
          <span>SYSTEM STATE: <span className="opacity-80">READY TO RECOMPILE</span></span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">STATIC GENERATOR: <span className="opacity-80 uppercase">ENABLED</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <span>Engine v1.0.4 Premium</span>
          <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold cursor-help" title="Webcraft visual generator documentation">?</div>
        </div>
      </footer>
    </div>
  );
}
