/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Website, ElementInstance, DbProvider, FirebaseConfig, SupabaseConfig, ElementType } from './types';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import CodeExporter from './components/CodeExporter';
import LivePreview from './components/LivePreview';
import TemplateLibrary from './components/TemplateLibrary';
import { LayoutGrid, ArrowLeft, Save, Play, ExternalLink, HelpCircle, Shield, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [selectedSite, setSelectedSite] = useState<Website | null>(null);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Layout View Controls
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);

  // Connection settings
  const [dbProvider, setDbProvider] = useState<DbProvider>('none');
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfig>({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: '',
    anonKey: ''
  });

  const handleApplyTemplate = (elements: ElementInstance[], mode: 'replace' | 'append' = 'replace') => {
    if (!selectedSite) return;
    
    const elementsWithNewIds = elements.map(el => {
      const newId = `${el.type}-${Math.random().toString(36).substring(2, 9)}`;
      return {
        ...el,
        id: newId
      };
    });
    
    let updatedElements = [];
    if (mode === 'append') {
      updatedElements = [...selectedSite.elements, ...elementsWithNewIds];
    } else {
      updatedElements = elementsWithNewIds;
    }
    
    const updatedSite = {
      ...selectedSite,
      elements: updatedElements
    };
    
    setSelectedSite(updatedSite);
    
    const listJson = localStorage.getItem('webcraft_saved_sites') || '[]';
    let list: Website[] = [];
    try {
      list = JSON.parse(listJson);
    } catch (err) {}
    
    const existsIdx = list.findIndex(s => s.id === selectedSite.id);
    if (existsIdx !== -1) {
      list[existsIdx] = updatedSite;
    } else {
      list.push(updatedSite);
    }
    localStorage.setItem('webcraft_saved_sites', JSON.stringify(list));
    
    if (mode === 'replace') {
      setActiveElementId(updatedElements[0]?.id || null);
    } else {
      setActiveElementId(elementsWithNewIds[0]?.id || null);
    }
  };

  const handleSelectSite = (site: Website) => {
    setSelectedSite(site);
    setDbProvider(site.integration.provider);
    if (site.integration.firebase) setFirebaseConfig(site.integration.firebase);
    if (site.integration.supabase) setSupabaseConfig(site.integration.supabase);
    setCurrentView('editor');
    // Default select first element if available
    if (site.elements.length > 0) {
      setActiveElementId(site.elements[0].id);
    } else {
      setActiveElementId(null);
    }
  };

  const handleUpdateSiteName = (name: string) => {
    if (!selectedSite) return;
    setSelectedSite({ ...selectedSite, name });
  };

  const handleUpdateSiteDescription = (description: string) => {
    if (!selectedSite) return;
    setSelectedSite({ ...selectedSite, description });
  };

  const handleUpdateSiteFields = (fields: Partial<Website>) => {
    if (!selectedSite) return;
    setSelectedSite({ ...selectedSite, ...fields });
  };

  const handleAddElement = (type: ElementType, customProps?: any) => {
    if (!selectedSite) return;

    let props: any = {};
    if (type === 'header') {
      props = {
        logoText: '✦ VenturFlow',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Register', href: '#waitlist' }
        ],
        style: {
          bgColor: 'bg-slate-900',
          textColor: 'text-white',
          paddingY: 'py-4',
          paddingX: 'px-6'
        }
      };
    } else if (type === 'hero') {
      props = {
        title: 'Accelerate Customer Operations visually',
        subtitle: 'Map secure database forms and conditionally authorized page folders. Fully functional, responsive, compiled.',
        buttonText: 'Join Beta Portal',
        buttonLink: '#waitlist',
        imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800',
        style: {
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-800',
          paddingY: 'py-16',
          paddingX: 'px-6',
          alignment: 'center'
        }
      };
    } else if (type === 'title') {
      props = {
        text: 'Custom Title Segment',
        style: {
          alignment: 'center',
          fontSize: '2xl',
          textColor: 'text-slate-900',
          paddingY: 'py-4'
        }
      };
    } else if (type === 'text') {
      props = {
        content: 'Edit this explanatory paragraph visuals directly by selecting this frame item in the living preview canvas.',
        style: {
          alignment: 'left',
          fontSize: 'base',
          textColor: 'text-slate-700',
          paddingY: 'py-2'
        }
      };
    } else if (type === 'image') {
      props = {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
        alt: 'Graphic Representation',
        style: {
          alignment: 'center',
          paddingY: 'py-4'
        }
      };
    } else if (type === 'button') {
      props = {
        text: 'Action Button Link',
        link: '#',
        actionType: 'link',
        style: {
          alignment: 'center',
          btnBgColor: 'bg-indigo-600',
          btnTextColor: 'text-white',
          borderRadius: 'rounded-lg',
          paddingY: 'py-4'
        }
      };
    } else if (type === 'features') {
      props = {
        title: 'Enterprise Virtues Deployed',
        columns: 3,
        items: [
          { id: 'f1', title: 'Zero Vendor Lock-in', desc: 'Download standalone index.html hosting files with absolutely zero recurring portal fees.', iconName: 'Layers' },
          { id: 'f2', title: 'Durable Integrity', desc: 'Wired secure client form actions straight to Firestore/Supabase tables out of the box.', iconName: 'Database' }
        ],
        style: {
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-900',
          paddingY: 'py-12'
        }
      };
    } else if (type === 'form') {
      props = {
        title: 'Connective Database Form',
        submitButtonText: 'Register Workspace',
        targetTable: 'subscribers',
        fields: [
          { id: 'fld-email', name: 'email', label: 'Work Email Address', placeholder: 'name@workspace.com', type: 'email', required: true }
        ],
        style: {
          bgColor: 'bg-white',
          textColor: 'text-slate-800',
          formBgColor: 'bg-slate-50',
          btnBgColor: 'bg-indigo-600',
          btnTextColor: 'text-white',
          paddingY: 'py-12'
        }
      };
    } else if (type === 'protected') {
      props = {
        title: '🔒 Verified Lounge Gateway',
        message: 'In your compiled code, our verified client auth session ensures this block content only renders once a login executes.',
        authMode: 'show_if_logged_in',
        style: {
          bgColor: 'bg-indigo-50/50',
          textColor: 'text-indigo-900',
          borderColor: 'border-indigo-150',
          paddingY: 'py-10'
        }
      };
    } else if (type === 'auth_form') {
      props = {
        title: 'Aesthetic Secure Passport Portal',
        subtitle: 'Secure zero-trust login & signup portal. Enter your credential pairs below to authorize active session caches.',
        mode: 'login_signup_box', // 'login' | 'signup' | 'login_signup_box'
        successRedirectUrl: '#member-dashboard',
        style: {
          bgColor: 'bg-slate-900',
          textColor: 'text-slate-100',
          formBgColor: 'bg-slate-950/80',
          btnBgColor: 'bg-indigo-600',
          btnTextColor: 'text-white',
          paddingY: 'py-16'
        }
      };
    } else if (type === 'plugin') {
      props = {
        pluginId: customProps?.pluginId || 'plugin-testimonials',
        ...customProps
      };
    } else if (type === 'footer') {
      props = {
        copyright: '© 2026 Compile Engine Corp. Assembled visually.',
        style: {
          bgColor: 'bg-slate-900',
          textColor: 'text-slate-400',
          paddingY: 'py-8',
          alignment: 'center'
        }
      };
    } else if (type === 'divider') {
      props = {};
    }

    const newElement: ElementInstance = {
      id: `${type}-${Date.now()}`,
      type,
      props
    };

    const updatedElements = [...selectedSite.elements, newElement];
    setSelectedSite({ ...selectedSite, elements: updatedElements });
    setActiveElementId(newElement.id);
  };

  const handleUpdateElementProps = (updatedProps: any) => {
    if (!selectedSite || !activeElementId) return;
    const updated = selectedSite.elements.map(el => {
      if (el.id === activeElementId) {
        return { ...el, props: updatedProps };
      }
      return el;
    });
    setSelectedSite({ ...selectedSite, elements: updated });
  };

  const handleRemoveElement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSite) return;
    const updated = selectedSite.elements.filter(el => el.id !== id);
    if (activeElementId === id) setActiveElementId(null);
    setSelectedSite({ ...selectedSite, elements: updated });
  };

  const handleMoveElement = (id: string, direction: 'up' | 'down') => {
    if (!selectedSite) return;
    const idx = selectedSite.elements.findIndex(el => el.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === selectedSite.elements.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...selectedSite.elements];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    setSelectedSite({ ...selectedSite, elements: updated });
  };

  const handleSaveToWorkspace = () => {
    if (!selectedSite) return;
    
    // Package credentials into site schema
    const siteWithIntegration: Website = {
      ...selectedSite,
      integration: {
        provider: dbProvider,
        firebase: firebaseConfig,
        supabase: supabaseConfig
      },
      createdAt: new Date().toISOString()
    };

    const listJson = localStorage.getItem('webcraft_saved_sites') || '[]';
    let list: Website[] = [];
    try {
      list = JSON.parse(listJson);
    } catch (err) {}

    const existsIdx = list.findIndex(s => s.id === selectedSite.id);
    if (existsIdx !== -1) {
      list[existsIdx] = siteWithIntegration;
    } else {
      list.push(siteWithIntegration);
    }

    localStorage.setItem('webcraft_saved_sites', JSON.stringify(list));
    alert(`✓ Project '${selectedSite.name}' successfully persisted in cloud workspace!`);
  };

  const handleRestoreVersion = (
    restoredElements: ElementInstance[],
    restoredProvider: DbProvider,
    fb?: FirebaseConfig,
    sb?: SupabaseConfig
  ) => {
    if (!selectedSite) return;

    setDbProvider(restoredProvider);
    if (fb) setFirebaseConfig(fb);
    if (sb) setSupabaseConfig(sb);

    const updatedSite: Website = {
      ...selectedSite,
      elements: restoredElements,
      integration: {
        provider: restoredProvider,
        firebase: fb,
        supabase: sb
      }
    };

    setSelectedSite(updatedSite);

    if (restoredElements.length > 0) {
      setActiveElementId(restoredElements[0].id);
    } else {
      setActiveElementId(null);
    }

    const listJson = localStorage.getItem('webcraft_saved_sites') || '[]';
    let list: Website[] = [];
    try {
      list = JSON.parse(listJson);
    } catch (err) {}

    const existsIdx = list.findIndex(s => s.id === selectedSite.id);
    if (existsIdx !== -1) {
      list[existsIdx] = updatedSite;
    } else {
      list.push(updatedSite);
    }
    localStorage.setItem('webcraft_saved_sites', JSON.stringify(list));
  };

  // Quick fallback active selected element instance helper
  const getSelectedElementInstance = (): ElementInstance | null => {
    if (!selectedSite || !activeElementId) return null;
    return selectedSite.elements.find(el => el.id === activeElementId) || null;
  };

  if (currentView === 'dashboard') {
    return <Dashboard onSelectSite={handleSelectSite} />;
  }

  // Active Editor View Layout
  return (
    <div id="editor-workspace" className="min-h-screen bg-[#0A0A0C] flex flex-col font-sans text-slate-300 overflow-hidden relative">
      
      {/* Editor Top Bar Controls */}
      <header id="editor-nav-bar" className="bg-[#0F0F12] border-b border-slate-800 py-3 px-6 h-14 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            id="btn-nav-dashboard"
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedSite(null);
            }}
            className="p-2 bg-slate-900 hover:bg-[#1A1A22] rounded-xl transition border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Return to Preset Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-4 w-4 text-indigo-400" />
            <input
              id="editor-site-name-input"
              type="text"
              value={selectedSite?.name || ''}
              onChange={(e) => handleUpdateSiteName(e.target.value)}
              className="font-bold text-white border-b border-transparent hover:border-slate-800 focus:border-indigo-500 focus:outline-none px-1 text-sm bg-transparent"
              title="Click to rename design project"
            />
          </div>
        </div>

        {/* Dynamic Sidebar Control Center */}
        <div className="hidden md:flex bg-[#121216] border border-slate-800 rounded-xl p-1 items-center space-x-1.5">
          <button
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              !leftSidebarCollapsed 
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Toggle Left Build panel drawer"
          >
            {leftSidebarCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            <span className="text-[10.5px]">Tools</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-800"></div>

          {/* Glowing Bento Template Library Launcher */}
          <button
            id="launch-bento-library-btn"
            onClick={() => setShowTemplateLibrary(true)}
            className="h-8 px-3.5 bg-gradient-to-r from-indigo-950 to-[#2A1B3D] hover:from-indigo-900 hover:to-[#382255] border border-indigo-500/40 text-indigo-200 hover:text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 duration-100 cursor-pointer shadow-indigo-500/10 shadow-sm"
            title="Open Bento Style Landing Page Templates"
          >
            <Sparkles className="h-3.5 w-3.5 text-pink-400 animate-pulse" />
            <span className="font-mono text-[10px] tracking-wider">BENTO TEMPLATES</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800"></div>

          <button
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              !rightSidebarCollapsed 
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-300' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
            title="Toggle Right Code Exporter panel drawer"
          >
            <span className="text-[10.5px]">Code</span>
            {rightSidebarCollapsed ? <PanelRightOpen className="h-3.5 w-3.5" /> : <PanelRightClose className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center space-x-2.5">
          <button
            id="btn-cloud-save"
            onClick={handleSaveToWorkspace}
            className="h-9 px-3.5 bg-slate-900 hover:bg-[#1A1A22] border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Workspace</span>
          </button>

          <button
            id="btn-open-preview"
            onClick={() => setShowLivePreview(true)}
            className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shadow-sm active:scale-95 duration-100 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Live Workspace Preview</span>
          </button>
        </div>
      </header>

      {/* Main Column Grid */}
      <div id="editor-grid-pane" className="flex-1 flex overflow-hidden relative">
        
        {/* Absolute Recovery Tab Pulls */}
        {leftSidebarCollapsed && (
          <button
            onClick={() => setLeftSidebarCollapsed(false)}
            className="absolute left-0 top-[40%] z-30 h-20 w-3 bg-indigo-600 hover:bg-indigo-500 hover:w-5 transition-all rounded-r-lg flex items-center justify-center text-white cursor-pointer shadow-lg shadow-indigo-600/10 border border-l-0 border-indigo-400/20"
            title="Expand Left Build Panel"
          >
            <span className="text-[9px] uppercase font-bold select-none text-center leading-none">»</span>
          </button>
        )}
        
        {rightSidebarCollapsed && (
          <button
            onClick={() => setRightSidebarCollapsed(false)}
            className="absolute right-0 top-[40%] z-30 h-20 w-3 bg-indigo-600 hover:bg-indigo-500 hover:w-5 transition-all rounded-l-lg flex items-center justify-center text-white cursor-pointer shadow-lg shadow-indigo-600/10 border border-r-0 border-indigo-400/20"
            title="Expand Right Code Panel"
          >
            <span className="text-[9px] uppercase font-bold select-none text-center leading-none">«</span>
          </button>
        )}

        {/* Unit Column 1: Config Drawer Sidebar */}
        <aside 
          id="editor-sidebar-wrap" 
          className={`shrink-0 border-r border-slate-800 bg-[#0F0F12] h-full overflow-hidden transition-all duration-300 ease-in-out ${
            leftSidebarCollapsed ? 'w-0 p-0 border-r-0 opacity-0' : 'w-[380px] p-3.5 opacity-100'
          }`}
        >
          <Sidebar
            selectedElement={getSelectedElementInstance()}
            onUpdateElementProps={handleUpdateElementProps}
            onAddElement={handleAddElement}
            dbProvider={dbProvider}
            onChangeDbProvider={setDbProvider}
            firebaseConfig={firebaseConfig}
            supabaseConfig={supabaseConfig}
            onUpdateFirebaseConfig={(cfg) => setFirebaseConfig(prev => ({ ...prev, ...cfg }))}
            onUpdateSupabaseConfig={(cfg) => setSupabaseConfig(prev => ({ ...prev, ...cfg }))}
            siteName={selectedSite?.name || 'My Webcraft App'}
            onUpdateSiteName={handleUpdateSiteName}
            siteDescription={selectedSite?.description || ''}
            onUpdateSiteDescription={handleUpdateSiteDescription}
            onApplyTemplate={handleApplyTemplate}
            siteId={selectedSite?.id || ''}
            activeElements={selectedSite?.elements || []}
            onRestoreVersion={handleRestoreVersion}
            siteSeoKeywords={selectedSite?.seoKeywords || ''}
            onUpdateSiteSeoKeywords={(val) => handleUpdateSiteFields({ seoKeywords: val })}
            siteSeoAuthor={selectedSite?.seoAuthor || ''}
            onUpdateSiteSeoAuthor={(val) => handleUpdateSiteFields({ seoAuthor: val })}
            siteAeoStructuredType={selectedSite?.aeoStructuredType || 'Organization'}
            onUpdateSiteAeoStructuredType={(val) => handleUpdateSiteFields({ aeoStructuredType: val })}
            siteAeoPrimaryQuestion={selectedSite?.aeoPrimaryQuestion || ''}
            onUpdateSiteAeoPrimaryQuestion={(val) => handleUpdateSiteFields({ aeoPrimaryQuestion: val })}
            siteAeoAnswerMarkup={selectedSite?.aeoAnswerMarkup || ''}
            onUpdateSiteAeoAnswerMarkup={(val) => handleUpdateSiteFields({ aeoAnswerMarkup: val })}
            siteAeoCitations={selectedSite?.aeoCitations || ''}
            onUpdateSiteAeoCitations={(val) => handleUpdateSiteFields({ aeoCitations: val })}
            siteRobotsTxt={selectedSite?.robotsTxt || ''}
            onUpdateSiteRobotsTxt={(val) => handleUpdateSiteFields({ robotsTxt: val })}
            siteLlmsTxt={selectedSite?.llmsTxt || ''}
            onUpdateSiteLlmsTxt={(val) => handleUpdateSiteFields({ llmsTxt: val })}
            siteLlmsFullTxt={selectedSite?.llmsFullTxt || ''}
            onUpdateSiteLlmsFullTxt={(val) => handleUpdateSiteFields({ llmsFullTxt: val })}
          />
        </aside>

        {/* Unit Column 2: WYSIWYG Active Layout Canvas */}
        <main id="editor-canvas-stage" className="flex-1 overflow-y-auto p-6 bg-[#0A0A0C] min-w-0">
          <Canvas
            elements={selectedSite?.elements || []}
            selectedElementId={activeElementId}
            onSelectElement={setActiveElementId}
            onRemoveElement={handleRemoveElement}
            onMoveElement={handleMoveElement}
            onAddElement={handleAddElement}
            dbProvider={dbProvider}
          />
        </main>

        {/* Unit Column 3: Live Compiled Code and Exporter */}
        <aside 
          id="editor-exporter-wrap" 
          className={`shrink-0 border-l border-slate-800 bg-[#0F0F12] h-full overflow-hidden transition-all duration-300 ease-in-out ${
            rightSidebarCollapsed ? 'w-0 p-0 border-l-0 opacity-0' : 'w-[480px] p-4 opacity-100'
          }`}
        >
          <CodeExporter
            elements={selectedSite?.elements || []}
            siteName={selectedSite?.name || 'Visual Web App'}
            siteDescription={selectedSite?.description || ''}
            dbProvider={dbProvider}
            firebaseConfig={firebaseConfig}
            supabaseConfig={supabaseConfig}
            seoKeywords={selectedSite?.seoKeywords || ''}
            seoAuthor={selectedSite?.seoAuthor || ''}
            aeoStructuredType={selectedSite?.aeoStructuredType || 'Organization'}
            aeoPrimaryQuestion={selectedSite?.aeoPrimaryQuestion || ''}
            aeoAnswerMarkup={selectedSite?.aeoAnswerMarkup || ''}
            aeoCitations={selectedSite?.aeoCitations || ''}
            robotsTxt={selectedSite?.robotsTxt || ''}
            llmsTxt={selectedSite?.llmsTxt || ''}
            llmsFullTxt={selectedSite?.llmsFullTxt || ''}
          />
        </aside>

      </div>

      {/* Persistent Bento Status Bar */}
      <footer id="editor-state-monitor" className="h-8 bg-indigo-600 shrink-0 px-6 flex items-center justify-between text-[10px] text-white font-mono font-bold">
        <div className="flex gap-4">
          <span>ACTIVE ENDPOINT: <span className="opacity-80 uppercase">{dbProvider === 'none' ? 'LOCAL SANDBOX' : dbProvider}</span></span>
          <span>•</span>
          <span>COMPONENTS COUNT: <span className="opacity-90">{selectedSite?.elements.length || 0} BLOCKS</span></span>
          {activeElementId && (
            <>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline text-emerald-300">SELECTED NODE: {activeElementId.toUpperCase()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span>COMPILER: W3C STANDALONE RETINUE</span>
          <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-sans text-[9px] uppercase leading-none">Vite HMR Host</span>
        </div>
      </footer>

      {/* Fullscreen Live Simulation Sandbox Modal */}
      {showLivePreview && selectedSite && (
        <LivePreview
          compiledCode={document.getElementById('html-code-pre-box')?.innerText || ''}
          onClose={() => setShowLivePreview(false)}
          siteName={selectedSite.name}
        />
      )}

      {/* Bento Landing Page Template Library Overlay */}
      <TemplateLibrary
        isOpen={showTemplateLibrary}
        onClose={() => setShowTemplateLibrary(false)}
        onApplyTemplate={handleApplyTemplate}
      />

    </div>
  );
}
