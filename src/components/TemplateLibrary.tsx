import React, { useState } from 'react';
import { Website, ElementInstance } from '../types';
import { BENTO_TEMPLATES } from '../templates';
import { X, Search, Sparkles, Plus, RefreshCw, Layers, Check, ArrowRight } from 'lucide-react';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (elements: ElementInstance[], mode: 'replace' | 'append') => void;
}

export default function TemplateLibrary({ isOpen, onClose, onApplyTemplate }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTemplates = BENTO_TEMPLATES.filter(tpl => 
    tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tpl.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApply = (template: Website, mode: 'replace' | 'append') => {
    onApplyTemplate(template.elements, mode);
    setApplySuccessId(`${template.id}-${mode}`);
    setTimeout(() => {
      setApplySuccessId(null);
      onClose();
    }, 1500);
  };

  return (
    <div id="template-library-overlay" className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div 
        id="template-library-modal" 
        className="bg-[#0F0F12] border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header Header */}
        <header className="p-6 border-b border-slate-800 flex items-center justify-between relative shrink-0">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-950/50 rounded-2xl flex items-center justify-center border border-indigo-900/30 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                Bento Template Library
                <span className="text-[9px] bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-mono rounded px-2 py-0.5 leading-none">2026 EDITION</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Jumpstart your Visual Designs with high-converting asymmetric Grid architectures.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Filters and searching */}
        <div className="px-6 py-4 border-b border-slate-850 bg-[#0B0B0E] shrink-0 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
              <Search className="h-4 w-4" />
            </span>
            <input 
              type="text" 
              placeholder="Search Bento templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0C] border border-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-xl text-xs focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder-slate-500 h-10"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>SHOWING: <strong className="text-indigo-400">{filteredTemplates.length}</strong> BENTO PRESETS</span>
          </div>
        </div>

        {/* Templates Display Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <Layers className="h-10 w-10 text-slate-600 mx-auto mb-4" />
              <p className="text-sm text-slate-500 font-medium">No Bento templates found matching your credentials.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs text-indigo-400 hover:underline font-semibold"
              >
                Clear Search Query
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                
                // Identify colors/genres
                let genreBadge = 'bg-rose-950/40 text-rose-300 border-rose-900/30';
                if (tpl.id === 'bento-brand-showcase') {
                  genreBadge = 'bg-slate-800 text-slate-300 border-slate-700';
                } else if (tpl.id === 'bento-system-control') {
                  genreBadge = 'bg-emerald-950/40 text-emerald-300 border-emerald-900/30';
                }

                return (
                  <div 
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`bg-[#121217] border rounded-2xl p-5 flex flex-col justify-between transition min-h-[360px] cursor-pointer relative group ${
                      isSelected 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Visual Card Content */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase leading-none ${genreBadge}`}>
                          {tpl.id === 'bento-tech-hub' ? 'Tech Startup' : tpl.id === 'bento-brand-showcase' ? 'Creative Studio' : 'Dev Console'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          {tpl.elements.length} Section Blocks
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition tracking-tight">
                          {tpl.name}
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-4">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Mockup Grid representation */}
                      <div className="p-3 bg-[#0B0B0E] border border-slate-850 rounded-xl space-y-1.5 text-[9px] font-mono text-slate-400">
                        <div className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-1 border-b border-slate-800 pb-1">Included Elements:</div>
                        {tpl.elements.map((el, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500/60 inline-block"></span>
                            <span className="capitalize">{el.type === 'features' && el.props.layout === 'bento' ? 'Modern Bento Grid' : el.type} Block</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Action Buttons */}
                    <div className="pt-5 mt-4 border-t border-slate-800/80 space-y-2 relative">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(tpl, 'replace');
                          }}
                          className="h-8 rounded-lg bg-red-950/20 text-red-400 hover:bg-red-950/40 text-[10px] font-bold border border-red-900/30 flex items-center justify-center space-x-1 transition cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Start New Site</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(tpl, 'append');
                          }}
                          className="h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Append Blocks</span>
                        </button>
                      </div>

                      {/* Applied Status overlay banner */}
                      {applySuccessId === `${tpl.id}-replace` && (
                        <div className="absolute inset-0 bg-[#121217] rounded-xl flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                          <Check className="h-4 w-4 mr-1 animate-bounce" /> PROJECT JUMPSTARTED SUCCESSFULLY!
                        </div>
                      )}
                      {applySuccessId === `${tpl.id}-append` && (
                        <div className="absolute inset-0 bg-[#121217] rounded-xl flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                          <Check className="h-4 w-4 mr-1 animate-bounce" /> SECTIONS APPENDED SUCCESSFULLY!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Info Footer */}
        <footer className="p-4 bg-[#0A0A0C] border-t border-slate-800/60 text-[10px] text-center font-mono text-slate-500 shrink-0 flex justify-between px-6">
          <span>BENTO ARCHITECT: WEB BUILDER ACCELERATOR V2</span>
          <span>SELECT A PRESET PATTERN WITH STAGGERED INTEGRITY ACTIONS</span>
        </footer>
      </div>
    </div>
  );
}
