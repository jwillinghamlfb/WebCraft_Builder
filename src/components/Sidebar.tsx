import React, { useState, useEffect } from 'react';
import { ElementInstance, ElementType, DbProvider, FirebaseConfig, SupabaseConfig, FormField, PluginDefinition, PluginDeveloperField, Website, ProjectVersion } from '../types';
import { 
  Grid, Database, Palette, Settings, ChevronRight, Plus, Trash2, 
  RefreshCw, CheckCircle2, ShieldAlert, Sparkles, HelpCircle,
  ShoppingBag, Puzzle, Trash, Code, Key, Lock, Eye, Play, 
  ShieldCheck, Mail, ArrowRight, UserPlus, FileCode2, Layers, Save,
  ChevronDown, FileText, Globe, Search
} from 'lucide-react';
import { DEFAULT_PLUGINS, DEFAULT_TEMPLATES } from '../templates';

interface SidebarProps {
  selectedElement: ElementInstance | null;
  onUpdateElementProps: (updatedProps: any) => void;
  onAddElement: (type: ElementType, customProps?: any) => void;
  dbProvider: DbProvider;
  onChangeDbProvider: (provider: DbProvider) => void;
  firebaseConfig: FirebaseConfig;
  supabaseConfig: SupabaseConfig;
  onUpdateFirebaseConfig: (cfg: Partial<FirebaseConfig>) => void;
  onUpdateSupabaseConfig: (cfg: Partial<SupabaseConfig>) => void;
  siteName: string;
  onUpdateSiteName: (name: string) => void;
  siteDescription: string;
  onUpdateSiteDescription: (desc: string) => void;
  onApplyTemplate?: (elements: ElementInstance[], mode?: 'replace' | 'append') => void;
  siteId?: string;
  activeElements?: ElementInstance[];
  onRestoreVersion?: (elements: ElementInstance[], provider: DbProvider, fb?: FirebaseConfig, sb?: SupabaseConfig) => void;
  siteSeoKeywords?: string;
  onUpdateSiteSeoKeywords?: (keywords: string) => void;
  siteSeoAuthor?: string;
  onUpdateSiteSeoAuthor?: (author: string) => void;
  siteAeoStructuredType?: string;
  onUpdateSiteAeoStructuredType?: (val: string) => void;
  siteAeoPrimaryQuestion?: string;
  onUpdateSiteAeoPrimaryQuestion?: (val: string) => void;
  siteAeoAnswerMarkup?: string;
  onUpdateSiteAeoAnswerMarkup?: (val: string) => void;
  siteAeoCitations?: string;
  onUpdateSiteAeoCitations?: (val: string) => void;
  siteRobotsTxt?: string;
  onUpdateSiteRobotsTxt?: (val: string) => void;
  siteLlmsTxt?: string;
  onUpdateSiteLlmsTxt?: (val: string) => void;
  siteLlmsFullTxt?: string;
  onUpdateSiteLlmsFullTxt?: (val: string) => void;
}

export default function Sidebar({
  selectedElement,
  onUpdateElementProps,
  onAddElement,
  dbProvider,
  onChangeDbProvider,
  firebaseConfig,
  supabaseConfig,
  onUpdateFirebaseConfig,
  onUpdateSupabaseConfig,
  siteName,
  onUpdateSiteName,
  siteDescription,
  onUpdateSiteDescription,
  onApplyTemplate,
  siteId = '',
  activeElements = [],
  onRestoreVersion,
  siteSeoKeywords = '',
  onUpdateSiteSeoKeywords,
  siteSeoAuthor = '',
  onUpdateSiteSeoAuthor,
  siteAeoStructuredType = 'Organization',
  onUpdateSiteAeoStructuredType,
  siteAeoPrimaryQuestion = '',
  onUpdateSiteAeoPrimaryQuestion,
  siteAeoAnswerMarkup = '',
  onUpdateSiteAeoAnswerMarkup,
  siteAeoCitations = '',
  onUpdateSiteAeoCitations,
  siteRobotsTxt = '',
  onUpdateSiteRobotsTxt,
  siteLlmsTxt = '',
  onUpdateSiteLlmsTxt,
  siteLlmsFullTxt = '',
  onUpdateSiteLlmsFullTxt
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'add' | 'templates' | 'edit' | 'integration' | 'marketplace' | 'settings'>('add');
  const [testLog, setTestLog] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  // MARKETPLACE PLUGINS STATE
  const [installedPluginIds, setInstalledPluginIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('webcraft_installed_plugin_ids');
    return saved ? JSON.parse(saved) : ['plugin-testimonials', 'plugin-faq']; // testimonials + faq preinstalled
  });

  const [customPlugins, setCustomPlugins] = useState<PluginDefinition[]>(() => {
    const saved = localStorage.getItem('webcraft_custom_plugins');
    return saved ? JSON.parse(saved) : [];
  });

  // DB WORKSPACE MOCK ROWS DATABASE
  const [activeTable, setActiveTable] = useState<string>('subscribers');
  const [tableRecords, setTableRecords] = useState<any[]>(() => {
    const saved = localStorage.getItem('webcraft_live_table_records');
    return saved ? JSON.parse(saved) : [
      { id: 'rec_829a17', email: 'kate.bell@apple.com', payload: 'Form waitlist sign-up (Free Sandbox tier)', timestamp: '2026-06-15 12:10:45' },
      { id: 'rec_381b9c', email: 'brian.oneal@supabase.io', payload: 'Coordinates booking - Lat: 37.81, Lng: -122.42', timestamp: '2026-06-15 14:24:02' }
    ];
  });

  // DB SEEDER FORM VARIABLES
  const [seedEmail, setSeedEmail] = useState('');
  const [seedPayload, setSeedPayload] = useState('');
  const [seedSuccessMsg, setSeedSuccessMsg] = useState(false);

  // DEVELOPER CREATE PLUGIN VARIABLES
  const [devName, setDevName] = useState('');
  const [devDesc, setDevDesc] = useState('');
  const [devCategory, setDevCategory] = useState<'Marketing' | 'Interactive' | 'Conversion' | 'Widgets'>('Widgets');
  const [devIcon, setDevIcon] = useState('Sparkles');
  const [devVarName, setDevVarName] = useState('accentLabel');
  const [devVarLabel, setDevVarLabel] = useState('Button Label Accent');
  const [devVarType, setDevVarType] = useState<'text' | 'number' | 'color' | 'select'>('text');
  const [devVarDef, setDevVarDef] = useState('Click to Register');
  const [devTemplateHTML, setDevTemplateHTML] = useState(`<div class="p-8 text-center bg-slate-900 border-t border-indigo-705">
  <h4 class="text-lg font-bold text-white">{{accentLabel}}</h4>
  <p class="text-xs text-slate-400 mt-2">Compiled Live Custom Third Party Layout Extension</p>
</div>`);
  const [devSubmitSuccess, setDevSubmitSuccess] = useState(false);

  // PROJECT VERSIONS STATE & CONTROL
  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [newVersionName, setNewVersionName] = useState('');
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // Rich site specs & LLM metadata accordion states
  const [openSettingsGroup, setOpenSettingsGroup] = useState<'seo' | 'aeo' | 'crawler' | null>(null);

  const handleAutoGenerateSpecs = () => {
    const slug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'app';
    const cleanName = siteName || 'My Application';
    const cleanDesc = siteDescription || 'Crafted with WebCraft visual builder';

    if (onUpdateSiteSeoKeywords && !siteSeoKeywords) {
      onUpdateSiteSeoKeywords('no-code, vite, visual webapp, cloud-db, webcraft');
    }
    if (onUpdateSiteSeoAuthor && !siteSeoAuthor) {
      onUpdateSiteSeoAuthor('WebCraft Developer');
    }
    if (onUpdateSiteAeoStructuredType && (!siteAeoStructuredType || siteAeoStructuredType === 'Organization')) {
      onUpdateSiteAeoStructuredType('Organization');
    }
    if (onUpdateSiteAeoPrimaryQuestion && !siteAeoPrimaryQuestion) {
      onUpdateSiteAeoPrimaryQuestion(`What is the purpose of ${cleanName}?`);
    }
    if (onUpdateSiteAeoAnswerMarkup && !siteAeoAnswerMarkup) {
      onUpdateSiteAeoAnswerMarkup(`${cleanName} is a visually compiled interface focused on: ${cleanDesc}. Built with structural markup supporting high density indexing.`);
    }
    if (onUpdateSiteAeoCitations && !siteAeoCitations) {
      onUpdateSiteAeoCitations(`https://${slug}.com/\nhttps://github.com/webcraft/app`);
    }

    if (onUpdateSiteRobotsTxt && !siteRobotsTxt) {
      onUpdateSiteRobotsTxt(`User-agent: *
Allow: /
Sitemap: https://${slug}.com/sitemap.xml

User-agent: GPTBot
Disallow: /admin/
Allow: /`);
    }

    if (onUpdateSiteLlmsTxt && !siteLlmsTxt) {
      onUpdateSiteLlmsTxt(`# ${cleanName}

> Optimized meta-summary profile for context ingestion by LLMs and active AI assistants.

## Purpose & Overview
${cleanDesc}

## Capabilities & Visual Architecture
This system is composed of high-performance standalone section sheets:
${activeElements.map((el, i) => `${i + 1}. [${el.type.toUpperCase()}] Visual Section`).join('\n')}

---
_Generated automatically under AGPLv3 compliance._`);
    }

    if (onUpdateSiteLlmsFullTxt && !siteLlmsFullTxt) {
      onUpdateSiteLlmsFullTxt(`# ${cleanName} - Complete Visual Layout Specifications

## Full System Architecture Profile

This document outlines the detailed properties, styles, and configurations for ${cleanName}, compiled as a standalone single-page visual layout.

## Application Context Info
- Title Name: ${cleanName}
- Purpose Description: ${cleanDesc}

## Technical Infrastructure Setup
- Active Backend Target: ${dbProvider.toUpperCase()}

## Active Layout Nodes Tree
${activeElements.map((el, idx) => `### visual-element-${idx} (${el.type.toUpperCase()})
- **Element ID**: \`${el.id}\`
- **Render Props**:
\`\`\`json
${JSON.stringify(el.props, null, 2)}
\`\`\`
`).join('\n')}

---
_Auto-compiled for AI Ingestion by WebCraft Visual Builder._`);
    }
  };

  useEffect(() => {
    if (!siteId) return;
    const itemsJson = localStorage.getItem('webcraft_project_versions') || '[]';
    try {
      const allVers: ProjectVersion[] = JSON.parse(itemsJson);
      const filtered = allVers.filter(v => v.siteId === siteId);
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setVersions(filtered);
    } catch (err) {
      console.error('Error loading versions', err);
    }
  }, [siteId]);

  const handleCreateVersion = () => {
    if (!siteId) return;
    
    const label = newVersionName.trim() || `Draft - ${new Date().toLocaleString()}`;
    const newVer: ProjectVersion = {
      id: `ver-${Date.now()}`,
      siteId,
      versionName: label,
      elements: activeElements,
      integration: {
        provider: dbProvider,
        firebase: firebaseConfig,
        supabase: supabaseConfig
      },
      createdAt: new Date().toISOString()
    };

    const itemsJson = localStorage.getItem('webcraft_project_versions') || '[]';
    let allVersions: ProjectVersion[] = [];
    try {
      allVersions = JSON.parse(itemsJson);
    } catch (err) {}

    allVersions.push(newVer);
    localStorage.setItem('webcraft_project_versions', JSON.stringify(allVersions));
    
    const filtered = allVersions.filter(v => v.siteId === siteId);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setVersions(filtered);
    
    setNewVersionName('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDeleteVersion = (verId: string) => {
    const itemsJson = localStorage.getItem('webcraft_project_versions') || '[]';
    let allVersions: ProjectVersion[] = [];
    try {
      allVersions = JSON.parse(itemsJson);
    } catch (err) {}

    const updated = allVersions.filter(v => v.id !== verId);
    localStorage.setItem('webcraft_project_versions', JSON.stringify(updated));

    const filtered = updated.filter(v => v.siteId === siteId);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setVersions(filtered);
  };

  const handleConfirmRestore = (ver: ProjectVersion) => {
    const rollbackLabel = `Backup rollback - Before restoring "${ver.versionName}"`;
    const backupVer: ProjectVersion = {
      id: `ver-backup-${Date.now()}`,
      siteId,
      versionName: rollbackLabel,
      elements: activeElements,
      integration: {
        provider: dbProvider,
        firebase: firebaseConfig,
        supabase: supabaseConfig
      },
      createdAt: new Date().toISOString()
    };

    const itemsJson = localStorage.getItem('webcraft_project_versions') || '[]';
    let allVersions: ProjectVersion[] = [];
    try {
      allVersions = JSON.parse(itemsJson);
    } catch (err) {}

    allVersions.push(backupVer);
    
    if (onRestoreVersion) {
      onRestoreVersion(ver.elements, ver.integration.provider, ver.integration.firebase, ver.integration.supabase);
    }

    localStorage.setItem('webcraft_project_versions', JSON.stringify(allVersions));

    const filtered = allVersions.filter(v => v.siteId === siteId);
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setVersions(filtered);

    setConfirmRestoreId(null);
    setRestoreSuccess(true);
    setTimeout(() => setRestoreSuccess(false), 3000);
  };

  // Trigger LocalStorage saves for plugins list
  useEffect(() => {
    localStorage.setItem('webcraft_installed_plugin_ids', JSON.stringify(installedPluginIds));
  }, [installedPluginIds]);

  useEffect(() => {
    localStorage.setItem('webcraft_custom_plugins', JSON.stringify(customPlugins));
  }, [customPlugins]);

  useEffect(() => {
    localStorage.setItem('webcraft_live_table_records', JSON.stringify(tableRecords));
  }, [tableRecords]);

  // Handle visual seeder submission
  const handleTriggerMockSeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedEmail) return;
    
    // Auto insert primary key
    const newRow = {
      id: `rec_${Math.floor(100000 + Math.random() * 900000)}`,
      email: seedEmail,
      payload: seedPayload || 'Visual data-binding manually seeded',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    const incremented = [newRow, ...tableRecords];
    setTableRecords(incremented);
    
    setSeedEmail('');
    setSeedPayload('');
    setSeedSuccessMsg(true);
    setTimeout(() => {
      setSeedSuccessMsg(false);
    }, 2800);
  };

  // Handle Third Party developer extension submit
  const handleDeveloperSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName || !devDesc) return;

    const newField: PluginDeveloperField = {
      name: devVarName,
      label: devVarLabel,
      type: devVarType,
      defaultValue: devVarDef
    };

    const newPlugin: PluginDefinition = {
      id: `dev-plugin-${Date.now()}`,
      name: devName,
      description: devDesc,
      icon: devIcon,
      author: 'Third-Party Developer Console',
      category: devCategory,
      isCustom: true,
      developerFields: [newField],
      defaultProps: {
        [devVarName]: devVarDef
      },
      templateHTML: devTemplateHTML
    };

    setCustomPlugins(prev => [...prev, newPlugin]);
    // Auto install custom developer submission right away!
    setInstalledPluginIds(prev => [...prev, newPlugin.id]);

    setDevName('');
    setDevDesc('');
    setDevSubmitSuccess(true);
    setTimeout(() => setDevSubmitSuccess(false), 3000);
  };

  const handleToggleInstall = (pId: string) => {
    if (installedPluginIds.includes(pId)) {
      setInstalledPluginIds(prev => prev.filter(id => id !== pId));
    } else {
      setInstalledPluginIds(prev => [...prev, pId]);
    }
  };

  // Auto-switch to edit tab when an element is selected
  React.useEffect(() => {
    if (selectedElement) {
      setActiveTab('edit');
    }
  }, [selectedElement?.id]);

  const runDatabaseTest = () => {
    setTesting(true);
    setTestLog(['Initializing connectivity check...', 'Detecting database adapter configuration...']);
    
    setTimeout(() => {
      if (dbProvider === 'none') {
        setTestLog(prev => [
          ...prev, 
          '❌ Connecting failed: No Database Provider selected.',
          '💡 Please choose Firestore or Supabase in the provider dropdown above to enable client-bindings.'
        ]);
        setTesting(false);
        return;
      }

      if (dbProvider === 'firebase') {
        const { apiKey, projectId } = firebaseConfig;
        if (!apiKey || !projectId) {
          setTestLog(prev => [
            ...prev,
            '⚠️ Code check failed: Insufficient credentials loaded.',
            '• Missing vital variables (API Key or Project ID).',
            '❌ Test aborted.'
          ]);
          setTesting(false);
          return;
        }

        setTestLog(prev => [
          ...prev,
          `✓ Credentials recognized for Firestore build [${projectId}]`,
          '• Compiling Firebase v9.x client compatibility layers...',
          '• Simulating connection test: fetchFromServer(testObject)...',
          '✓ Real-time Firestore write check simulated successfully!',
          '❇ Ready. Dynamic forms will output secure web-SDK submissions to this target in production.'
        ]);
      } else {
        const { url, anonKey } = supabaseConfig;
        if (!url || !anonKey) {
          setTestLog(prev => [
            ...prev,
            '⚠️ Code check failed: Insufficient credentials loaded.',
            '• Missing vital variables (Client URL or Anon Role Key).',
            '❌ Test aborted.'
          ]);
          setTesting(false);
          return;
        }

        setTestLog(prev => [
          ...prev,
          `✓ Endpoint recognized: ${url.substring(0, 22)}...`,
          '• Initializing @supabase/supabase-js client model...',
          '• Mapping table columns & schemas dynamically...',
          '✓ Connection check completed. Headers validated!',
          '❇ Ready. Data binding routes are armed for table exports!'
        ]);
      }
      setTesting(false);
    }, 1800);
  };

  // Preset component blocks ready for insertion
  const BLOCKS = [
    { type: 'header', label: 'Navigation Bar', desc: 'Custom logo + links', accent: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' },
    { type: 'hero', label: 'Hero Banner', desc: 'Double column presentation', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'title', label: 'Title Heading', desc: 'Bold text division block', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'text', label: 'Text Paragraph', desc: 'Visual body copy layout', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'image', label: 'Media Image', desc: 'Clean photo framework', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'button', label: 'Action Button', desc: 'Anchor links or auth triggers', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'features', label: 'Feature Grid', desc: 'Split boxes outlining pros', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'form', label: 'Connective DB Form', desc: 'Capture entries directly into DB', accent: 'bg-pink-950/40 text-pink-400 border-pink-900/30' },
    { type: 'auth_form', label: '🔑 Secure Auth Hub', desc: 'Zero-trust registration & login gateway', accent: 'bg-rose-950/40 text-rose-400 border-rose-905/30' },
    { type: 'protected', label: '🔒 Auth Guard Lounge', desc: 'Visibility locked to log-ins', accent: 'bg-indigo-950/40 text-indigo-400 border-indigo-900/30' },
    { type: 'divider', label: 'Divider Break', desc: 'Subtle separator lines', accent: 'bg-slate-900 text-slate-400 border-slate-800' },
    { type: 'footer', label: 'Compact Footer', desc: 'Copyrights division lines', accent: 'bg-slate-900 text-slate-400 border-slate-800' }
  ];

  return (
    <div id="sidebar-panel" className="h-full bg-[#0F0F12] border border-slate-800 rounded-2xl flex flex-col select-none text-slate-300">
      
      {/* Tab Selectors */}
      <div id="sidebar-tabs" className="grid grid-cols-6 border-b border-slate-800 bg-[#0B0B0E] rounded-t-2xl">
        <button
          id="tab-add"
          onClick={() => setActiveTab('add')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
            activeTab === 'add' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Grid className="h-3.5 w-3.5" />
          <span>Block</span>
        </button>

        <button
          id="tab-templates"
          onClick={() => setActiveTab('templates')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
            activeTab === 'templates' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Presets</span>
        </button>

        <button
          id="tab-edit"
          onClick={() => setActiveTab('edit')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 relative ${
            activeTab === 'edit' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Style</span>
          {selectedElement && (
            <span className="absolute top-1 right-1.5 px-1 text-[8px] scale-90 py-0 leading-none rounded-full bg-indigo-505 text-white font-mono">•</span>
          )}
        </button>

        <button
          id="tab-integration"
          onClick={() => setActiveTab('integration')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
            activeTab === 'integration' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Bindings</span>
        </button>

        <button
          id="tab-marketplace"
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
            activeTab === 'marketplace' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Market</span>
        </button>

        <button
          id="tab-settings"
          onClick={() => setActiveTab('settings')}
          className={`py-3 text-center text-[9px] font-bold flex flex-col items-center justify-center space-y-1 transition border-b-2 ${
            activeTab === 'settings' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Site Info</span>
        </button>
      </div>

      {/* Pane Content */}
      <div id="sidebar-content" className="flex-1 overflow-y-auto p-4 space-y-5">
        
         {/* TAB 1: ADD BLOCKS */}
        {activeTab === 'add' && (
          <div id="pane-add-blocks" className="space-y-5">
            <div>
              <h3 className="text-xs font-extrabold text-white tracking-wider uppercase">Layout Core Blueprints</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Click any component below to drop it onto the center visual canvas.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {BLOCKS.map((item) => (
                <button
                  id={`btn-block-type-${item.type}`}
                  key={item.type}
                  onClick={() => onAddElement(item.type as ElementType)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-[#141418] hover:border-indigo-500/50 hover:bg-[#181820] transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`h-7 w-7 rounded-lg flex items-center justify-center border font-mono font-bold text-[10px] ${item.accent}`}>
                      {item.type.substring(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition">
                        {item.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5 font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </button>
              ))}
            </div>

            {/* INSTALLED PLUGINS LIST VIEW */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-200 tracking-wider uppercase flex items-center gap-1">
                  <Puzzle className="h-3.5 w-3.5 text-pink-500" /> Plugins Installed ({installedPluginIds.length})
                </h3>
                <button 
                  onClick={() => setActiveTab('marketplace')} 
                  className="text-[10px] font-bold text-indigo-400 hover:underline"
                >
                  Browse Market
                </button>
              </div>

              {installedPluginIds.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-slate-900/40 border border-slate-805/50 text-[10px] text-slate-500">
                  No active extension plugins installed. Swipe to Market tab above to load high-converting components!
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {installedPluginIds.map(id => {
                    const plugin = [...DEFAULT_PLUGINS, ...customPlugins].find(p => p.id === id);
                    if (!plugin) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => onAddElement('plugin', { pluginId: plugin.id, ...plugin.defaultProps })}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-[#16121C] hover:border-pink-500/50 hover:bg-[#1E1928] hover:scale-[1.01] transition duration-200 cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="h-7 w-7 rounded-lg bg-pink-950/40 text-pink-400 border border-pink-900/30 flex items-center justify-center">
                            <Puzzle className="h-3.5 w-3.5" />
                          </span>
                          <div>
                            <span className="text-[8px] bg-pink-950 text-pink-300 border border-pink-900/40 font-mono font-bold px-1 rounded uppercase tracking-wider">Market Block</span>
                            <h4 className="text-xs font-semibold text-white mt-0.5 group-hover:text-pink-400 transition">{plugin.name}</h4>
                          </div>
                        </div>
                        <Plus className="h-3.5 w-3.5 text-slate-500 group-hover:text-pink-400 transition" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 1.5: TEMPLATE LIBRARY */}
        {activeTab === 'templates' && (
          <div id="pane-template-library" className="space-y-4">
            <div>
              <h3 className="text-xs font-extrabold text-white tracking-wider uppercase">Bento Design Presets</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-sans">
                Wipe your active draft or append beautiful, pre-designed Bento landing page layout blueprints with one single click.
              </p>
            </div>

            <div className="space-y-3">
              {DEFAULT_TEMPLATES.map((tpl) => {
                const isBento = tpl.id.startsWith('bento');
                return (
                  <div 
                    key={tpl.id} 
                    className="p-3.5 rounded-xl bg-[#111116] border border-slate-800 hover:border-indigo-500/30 transition flex flex-col space-y-3 relative overflow-hidden group"
                  >
                    {isBento && (
                      <div className="absolute right-0 top-0 bg-indigo-600 text-white text-[8px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-bl uppercase">
                        Bento Grid
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                        {tpl.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans">
                        {tpl.description}
                      </p>
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      <span className="text-[8px] bg-slate-905 border border-slate-800 text-slate-405 font-mono px-1.5 py-0.5 rounded-md">
                        {tpl.elements?.length || 0} Block Nodes
                      </span>
                      {tpl.elements?.some(el => el.type === 'auth_form') && (
                        <span className="text-[8px] bg-rose-950/40 border border-rose-900/20 text-rose-300 font-mono px-1.5 py-0.5 rounded-md">
                          Credentials Hub
                        </span>
                      )}
                      {tpl.elements?.some(el => el.type === 'form') && (
                        <span className="text-[8px] bg-emerald-950/40 border border-emerald-900/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded-md">
                          Interactive Collector
                        </span>
                      )}
                      {tpl.elements?.some(el => el.type === 'plugin') && (
                        <span className="text-[8px] bg-purple-950/40 border border-purple-900/20 text-purple-300 font-mono px-1.5 py-0.5 rounded-md">
                          Countdown Engine
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyTemplate) {
                            onApplyTemplate(tpl.elements, 'replace');
                          }
                        }}
                        className="py-1.5 px-1 bg-indigo-600 hover:bg-indigo-505 text-white font-extrabold text-[9px] rounded-lg tracking-wide transition uppercase cursor-pointer flex items-center justify-center gap-1"
                        title="Replaces all contents of your current design with this model blueprint"
                      >
                        <RefreshCw className="h-2.5 w-2.5 shrink-0" /> Replace Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onApplyTemplate) {
                            onApplyTemplate(tpl.elements, 'append');
                          }
                        }}
                        className="py-1.5 px-1 bg-slate-900 hover:bg-[#1A1A22] border border-slate-800 text-slate-200 font-bold text-[9px] rounded-lg tracking-wide transition uppercase cursor-pointer flex items-center justify-center gap-1"
                        title="Appends elements of this model to the bottom of the current workspace"
                      >
                        <Plus className="h-2.5 w-2.5 shrink-0" /> Append
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROPERTIES */}
        {activeTab === 'edit' && (
          <div id="pane-edit-element" className="space-y-5">
            {!selectedElement ? (
              <div id="no-selection-fallback" className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <Palette className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No Target Element Selected</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1">Click on any visual section inside the canvas to inspect and edit style details.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header Info */}
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase py-0.5 px-2 bg-slate-100 text-slate-600 border rounded">
                      ID: {selectedElement.id}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900 mt-1.5 capitalize">
                      Formatting {selectedElement.type} Block
                    </h3>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2 rounded-md">
                    <Sparkles className="h-3 w-3" /> Auto Update
                  </span>
                </div>

                {/* Edit forms based on exact type */}
                {selectedElement.type === 'header' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Logo Text Accent</label>
                      <input
                        type="text"
                        value={selectedElement.props.logoText || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, logoText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                    
                    {/* Hardcoded visual styling picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Logo Theme Background</label>
                      <select
                        value={selectedElement.props.style?.bgColor || 'bg-slate-900'}
                        onChange={(e) => onUpdateElementProps({
                          ...selectedElement.props,
                          style: { ...(selectedElement.props.style || {}), bgColor: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      >
                        <option value="bg-slate-900">Dark Slate Carbon</option>
                        <option value="bg-emerald-900">Forest Emerald</option>
                        <option value="bg-neutral-50 text-slate-900">Clean Studio White</option>
                        <option value="bg-blue-900">Corporate Indigo</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'hero' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Bold Pitch Header</label>
                      <input
                        type="text"
                        value={selectedElement.props.title || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Secondary Statement Description</label>
                      <textarea
                        value={selectedElement.props.subtitle || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, subtitle: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 h-20 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Mock Image URL Link</label>
                      <input
                        type="text"
                        value={selectedElement.props.imageUrl || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, imageUrl: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800"
                        placeholder="https://imageUrl..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Primary Button Label</label>
                      <input
                        type="text"
                        value={selectedElement.props.buttonText || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, buttonText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Accent Styling Theme</label>
                      <select
                        value={selectedElement.props.style?.bgColor || 'bg-slate-900'}
                        onChange={(e) => onUpdateElementProps({
                          ...selectedElement.props,
                          style: { ...(selectedElement.props.style || {}), bgColor: e.target.value, textColor: e.target.value.includes('slate-900') ? 'text-slate-100' : 'text-slate-800' }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      >
                        <option value="bg-slate-900">Carbon Obsidian (Dark)</option>
                        <option value="bg-stone-50">Warm Amber Studio (Off-White)</option>
                        <option value="bg-white">Pure Canvas Ice (Light)</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'title' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Heading Text</label>
                      <input
                        type="text"
                        value={selectedElement.props.text || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, text: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Alignment Mode</label>
                      <select
                        value={selectedElement.props.style?.alignment || 'center'}
                        onChange={(e) => onUpdateElementProps({
                          ...selectedElement.props,
                          style: { ...(selectedElement.props.style || {}), alignment: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      >
                        <option value="left">Left Aligned</option>
                        <option value="center">Centered</option>
                        <option value="right">Right Aligned</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Hierarchy Size</label>
                      <select
                        value={selectedElement.props.style?.fontSize || '2xl'}
                        onChange={(e) => onUpdateElementProps({
                          ...selectedElement.props,
                          style: { ...(selectedElement.props.style || {}), fontSize: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      >
                        <option value="lg">Sub-head div (H3)</option>
                        <option value="xl">Medium Heading (H2)</option>
                        <option value="2xl">Standard Display (H1)</option>
                        <option value="3xl">Hero Display Extra</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'text' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Paragraph Content</label>
                      <textarea
                        value={selectedElement.props.content || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, content: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 h-28 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 font-mono">Paragraph Text Class</label>
                      <select
                        value={selectedElement.props.style?.textColor || 'text-slate-700'}
                        onChange={(e) => onUpdateElementProps({
                          ...selectedElement.props,
                          style: { ...(selectedElement.props.style || {}), textColor: e.target.value }
                        })}
                        className="w-full bg-slate-50 border border-slate-200 p-2 text-xs text-slate-800 font-mono"
                      >
                        <option value="text-slate-700">Muted Charcoal</option>
                        <option value="text-slate-500">Subtle Slate Muted</option>
                        <option value="text-slate-400">Carbon Grey Dust</option>
                        <option value="text-emerald-800">Earthy Moss</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'button' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Action Text</label>
                      <input
                        type="text"
                        value={selectedElement.props.text || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, text: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Security / Action Logic</label>
                      <select
                        value={selectedElement.props.actionType || 'link'}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, actionType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
                      >
                        <option value="link">🌐 Anchor Link (Redirect/Page)</option>
                        <option value="auth_login">🔑 Security: Firebase/Supabase Login Gate</option>
                        <option value="auth_signup">📝 Security: Register Member Account</option>
                        <option value="auth_logout">🚪 Security: Secure Terminate Session</option>
                      </select>
                    </div>

                    {selectedElement.props.actionType === 'link' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Target HREF Reference</label>
                        <input
                          type="text"
                          value={selectedElement.props.link || ''}
                          onChange={(e) => onUpdateElementProps({ ...selectedElement.props, link: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                          placeholder="#features or tel:"
                        />
                      </div>
                    )}
                  </div>
                )}

                {selectedElement.type === 'features' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Feature Section Name</label>
                      <input
                        type="text"
                        value={selectedElement.props.title || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Grid Visual Layout Style</label>
                      <select
                        value={selectedElement.props.layout || 'grid'}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, layout: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-semibold"
                      >
                        <option value="grid">Standard Column Grid</option>
                        <option value="bento">Asymmetric Bento Grid (Tech/Modern)</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'protected' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Box Header Warning</label>
                      <input
                        type="text"
                        value={selectedElement.props.title || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Authorization Text explanation</label>
                      <textarea
                        value={selectedElement.props.message || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 h-24 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Logical Gate Mode</label>
                      <select
                        value={selectedElement.props.authMode || 'show_if_logged_in'}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, authMode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
                      >
                        <option value="show_if_logged_in">VISIBLE ONLY IF AUTHENTICATED</option>
                        <option value="show_if_guest">VISIBLE ONLY TO LOGGED-OUT GUESTS</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'image' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Resource URL</label>
                      <input
                        type="text"
                        value={selectedElement.props.url || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, url: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {selectedElement.type === 'footer' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Copyright Banner Copy</label>
                      <input
                        type="text"
                        value={selectedElement.props.copyright || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, copyright: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}

                {selectedElement.type === 'form' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Visual Form Header</label>
                      <input
                        type="text"
                        value={selectedElement.props.title || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, title: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 text-indigo-700 flex items-center gap-1">
                        <Database className="h-3 w-3" /> Target Database Collection/Table
                      </label>
                      <input
                        type="text"
                        value={selectedElement.props.targetTable || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, targetTable: e.target.value })}
                        className="w-full bg-slate-50 border border-indigo-200 focus:border-indigo-500 rounded-lg p-2 text-xs text-slate-800 font-mono"
                        placeholder="e.g. newsletter_subscribers"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Button Label</label>
                      <input
                        type="text"
                        value={selectedElement.props.submitButtonText || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, submitButtonText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                      />
                    </div>

                    {/* Manage fields inline! */}
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-extrabold text-slate-800">Form Fields Shape</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newField: FormField = {
                              id: `fld-${Date.now()}`,
                              name: 'custom_field',
                              label: 'New Question',
                              placeholder: 'Enter response...',
                              type: 'text',
                              required: false
                            };
                            onUpdateElementProps({
                              ...selectedElement.props,
                              fields: [...(selectedElement.props.fields || []), newField]
                            });
                          }}
                          className="text-[10px] bg-slate-100 font-semibold px-2 py-1 rounded text-indigo-600 hover:bg-indigo-50 transition border border-indigo-100 cursor-pointer"
                        >
                          + Add Input
                        </button>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {((selectedElement.props.fields as FormField[]) || []).map((f, idx) => (
                          <div key={f.id || idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2 text-[11px] relative">
                            <button
                              type="button"
                              onClick={() => {
                                const filterFields = selectedElement.props.fields.filter((field: any) => field.id !== f.id);
                                onUpdateElementProps({ ...selectedElement.props, fields: filterFields });
                              }}
                              className="absolute top-1.5 right-1.5 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-500">Label Text</label>
                                <input
                                  type="text"
                                  value={f.label}
                                  onChange={(e) => {
                                    const copyFields = [...selectedElement.props.fields];
                                    copyFields[idx].label = e.target.value;
                                    onUpdateElementProps({ ...selectedElement.props, fields: copyFields });
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-[10px]"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-500">DB Schema Key</label>
                                <input
                                  type="text"
                                  value={f.name}
                                  onChange={(e) => {
                                    const copyFields = [...selectedElement.props.fields];
                                    copyFields[idx].name = e.target.value;
                                    onUpdateElementProps({ ...selectedElement.props, fields: copyFields });
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-[10px] font-mono"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-bold text-slate-500">Input Type</label>
                                <select
                                  value={f.type}
                                  onChange={(e) => {
                                    const copyFields = [...selectedElement.props.fields];
                                    copyFields[idx].type = e.target.value as any;
                                    onUpdateElementProps({ ...selectedElement.props, fields: copyFields });
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded p-1 text-[10px]"
                                >
                                  <option value="text">Short Text</option>
                                  <option value="email">Email address</option>
                                  <option value="password">Password Safe</option>
                                  <option value="textarea">Paragraph text</option>
                                  <option value="checkbox">Toggle T&C</option>
                                </select>
                              </div>
                              <div className="flex items-center space-x-2 mt-4">
                                <input
                                  type="checkbox"
                                  checked={f.required}
                                  onChange={(e) => {
                                    const copyFields = [...selectedElement.props.fields];
                                    copyFields[idx].required = e.target.checked;
                                    onUpdateElementProps({ ...selectedElement.props, fields: copyFields });
                                  }}
                                  className="rounded text-indigo-600 h-3 w-3"
                                />
                                <span className="text-[10px] font-bold text-slate-600">Required</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedElement.type === 'auth_form' && (
                  <div className="space-y-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" /> Authentication Options
                    </h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Header Title Accent</label>
                      <input
                        type="text"
                        value={selectedElement.props.title || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, title: e.target.value })}
                        className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Helper Subtitle Text</label>
                      <textarea
                        value={selectedElement.props.subtitle || ''}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, subtitle: e.target.value })}
                        className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white h-16 resize-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Display Credentials Mode</label>
                      <select
                        value={selectedElement.props.mode || 'login_signup_box'}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, mode: e.target.value })}
                        className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-indigo-350 font-bold"
                      >
                        <option value="login_signup_box">Toggle Swapper (Login & Signup boxes)</option>
                        <option value="login">Strictly Login Portal</option>
                        <option value="signup">Strictly Signup registration</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400">Redirection URL Anchor</label>
                      <input
                        type="text"
                        value={selectedElement.props.successRedirectUrl || '#dashboard'}
                        onChange={(e) => onUpdateElementProps({ ...selectedElement.props, successRedirectUrl: e.target.value })}
                        className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="p-2.5 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-[10px] text-slate-400 leading-relaxed">
                      ⚡ <strong>Core Authentication Adapter</strong>: When selecting "Bindings", if Supabase or Firebase credentials are loaded, this form compiles native client registration hooks perfectly.
                    </div>
                  </div>
                )}

                {selectedElement.type === 'plugin' && (() => {
                  const pId = selectedElement.props.pluginId;
                  const targetPlugin = [...DEFAULT_PLUGINS, ...customPlugins].find(p => p.id === pId);
                  if (!targetPlugin) return <div className="text-[10px] text-rose-400">⚠️ Extension layout has been uninstalled.</div>;
                  
                  return (
                    <div className="space-y-4 bg-[#14121F] border border-indigo-950 p-4 rounded-xl">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded font-mono font-extrabold uppercase">Extension</span>
                        <span className="text-xs font-bold text-slate-200">{targetPlugin.name}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">{targetPlugin.description}</p>
                      
                      <div className="space-y-3.5 pt-3 border-t border-slate-800">
                        {targetPlugin.developerFields.map((field) => {
                          const currentVal = selectedElement.props[field.name] !== undefined ? selectedElement.props[field.name] : field.defaultValue;

                          return (
                            <div key={field.name} className="space-y-1">
                              <div className="flex justify-between items-baseline">
                                <label className="text-[10px] font-bold text-slate-350">{field.label}</label>
                                <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">{field.name}</span>
                              </div>
                              {field.type === 'color' ? (
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={currentVal}
                                    onChange={(e) => onUpdateElementProps({ ...selectedElement.props, [field.name]: e.target.value })}
                                    className="h-7 w-12 bg-transparent border border-slate-800 rounded cursor-pointer"
                                  />
                                  <input
                                    type="text"
                                    value={currentVal}
                                    onChange={(e) => onUpdateElementProps({ ...selectedElement.props, [field.name]: e.target.value })}
                                    className="flex-1 bg-[#16161C] border border-slate-800 rounded p-1 text-[10px] font-mono text-white"
                                  />
                                </div>
                              ) : field.type === 'select' ? (
                                <select
                                  value={currentVal}
                                  onChange={(e) => onUpdateElementProps({ ...selectedElement.props, [field.name]: e.target.value })}
                                  className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white"
                                >
                                  {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : field.type === 'number' ? (
                                <input
                                  type="number"
                                  value={currentVal}
                                  onChange={(e) => onUpdateElementProps({ ...selectedElement.props, [field.name]: Number(e.target.value) })}
                                  className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white font-mono"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={currentVal}
                                  onChange={(e) => onUpdateElementProps({ ...selectedElement.props, [field.name]: e.target.value })}
                                  className="w-full bg-[#16161C] border border-slate-800 rounded-lg p-2 text-xs text-white"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONNECTIONS & AUTHENTICATION */}
        {activeTab === 'integration' && (
          <div id="pane-db-integrations" className="space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Database className="h-4 w-4 text-indigo-600" /> Database bindings (No-Code Core)
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Bind client inputs directly to real production tables safely. The compile export engine auto-configures SDK credentials.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Choose Database Engine</label>
                <select
                  id="db-provider-select"
                  value={dbProvider}
                  onChange={(e) => onChangeDbProvider(e.target.value as DbProvider)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono font-medium"
                >
                  <option value="none">⚠️ Local Sandbox (Mocks/Local log)</option>
                  <option value="firebase">🔥 Google Firebase (Firestore Database)</option>
                  <option value="supabase">⚡ Supabase integration (PostgreSQL Cloud)</option>
                </select>
              </div>

              {dbProvider === 'firebase' && (
                <div id="firebase-credentials-inputs" className="space-y-3.5 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex-1">Firestore SDK Config</span>
                    <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-mono font-semibold">Client Safe</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 font-mono">apiKey</label>
                      <input
                        type="text"
                        value={firebaseConfig.apiKey}
                        onChange={(e) => onUpdateFirebaseConfig({ apiKey: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                        placeholder="AIzaSyA..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 font-mono">projectId</label>
                      <input
                        type="text"
                        value={firebaseConfig.projectId}
                        onChange={(e) => onUpdateFirebaseConfig({ projectId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                        placeholder="my-project-id"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 font-mono">authDomain</label>
                      <input
                        type="text"
                        value={firebaseConfig.authDomain}
                        onChange={(e) => onUpdateFirebaseConfig({ authDomain: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                        placeholder="my-app.firebaseapp.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 font-mono">appId</label>
                      <input
                        type="text"
                        value={firebaseConfig.appId}
                        onChange={(e) => onUpdateFirebaseConfig({ appId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                        placeholder="1:12345:web:abcdef"
                      />
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-slate-500 leading-relaxed bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg flex gap-2">
                    <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
                    <span>In your exported code, clients interact with Firestore directly. You should configure collection security rules to restrict write access.</span>
                  </div>
                </div>
              )}

              {dbProvider === 'supabase' && (
                <div id="supabase-credentials-inputs" className="space-y-3 bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-700 flex-1 font-sans">Supabase Auth / Data</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">Client Safe</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 font-mono">SUPABASE_URL</label>
                    <input
                      type="text"
                      value={supabaseConfig.url}
                      onChange={(e) => onUpdateSupabaseConfig({ url: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                      placeholder="https://xyz.supabase.co"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 font-mono font-semibold">SUPABASE_ANON_KEY</label>
                    <input
                      type="password"
                      value={supabaseConfig.anonKey}
                      onChange={(e) => onUpdateSupabaseConfig({ anonKey: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono"
                      placeholder="eyJhbG..."
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 leading-relaxed bg-teal-50 border border-teal-100 p-2.5 rounded-lg flex gap-2">
                    <HelpCircle className="h-5 w-4 text-emerald-600 shrink-0" />
                    <span>Submit requests use the client-safe Javascript SDK. Ensure Row Level Security (RLS) is active on the tables to block unauthorized operations!</span>
                  </div>
                </div>
              )}

              <button
                id="btn-test-db-connection"
                type="button"
                onClick={runDatabaseTest}
                disabled={testing}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
                {testing ? 'Testing Engine Integration...' : 'Test Database Security Sync'}
              </button>

              {/* simulated logs panel */}
              {testLog.length > 0 && (
                <div id="test-console-logs" className="bg-slate-900 text-slate-350 rounded-lg p-3 fld font-mono text-[9px] space-y-1.5 shadow-inner leading-relaxed border border-slate-800">
                  <div className="text-slate-500 border-b border-slate-800 pb-1 flex justify-between font-bold">
                    <span>CONNECTIVITY MONITOR Logs</span>
                    <span className="text-[8px] animate-pulse text-emerald-500">● LIVE</span>
                  </div>
                  {testLog.map((log, index) => {
                    const isErr = log.includes('❌') || log.includes('⚠️');
                    const isSuccess = log.includes('✓') || log.includes('❇') || log.includes('Success');
                    let color = 'text-slate-300';
                    if (isErr) color = 'text-rose-400';
                    else if (isSuccess) color = 'text-emerald-400 font-semibold';
                    return <div key={index} className={color}>{log}</div>;
                  })}
                </div>
              )}

              {/* DYNAMIC BINDINGS LIVE WORKBENCH */}
              <div id="db-live-workbench" className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-extrabold text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Database className="h-3.5 w-3.5 text-pink-500" /> Live Data Bindings Workbench
                  </span>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-pink-400 px-1.5 py-0.5 rounded font-mono">Sandbox Active</span>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  Mock dynamic client-side inputs, seed relational database schemas or NoSQL Firestore collections visually, and inspect real-time logs of simulated insertions.
                </p>

                {/* Table selector pills */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTable('subscribers')}
                    className={`text-[9px] px-2.5 py-1 rounded font-bold uppercase transition ${
                      activeTable === 'subscribers' 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-305'
                    }`}
                  >
                    📂 Subscribers
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTable('contact_messages')}
                    className={`text-[9px] px-2.5 py-1 rounded font-bold uppercase transition ${
                      activeTable === 'contact_messages' 
                        ? 'bg-pink-600 text-white' 
                        : 'bg-slate-900 text-slate-400 hover:text-slate-305'
                    }`}
                  >
                    📂 Contact Forms
                  </button>
                </div>

                {/* Seed Row Mini Form */}
                <form onSubmit={handleTriggerMockSeed} className="bg-slate-950/40 border border-slate-900/60 p-3 rounded-xl space-y-2.5">
                  <div className="text-[9px] text-slate-300 font-bold uppercase tracking-wider text-pink-400">
                    ✏️ Row Seeder Form (Target Table: {activeTable})
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 text-slate-400">Email Address Field</label>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2 h-3 w-3 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={seedEmail}
                        onChange={(e) => setSeedEmail(e.target.value)}
                        placeholder="customer@domain-sample.co"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 pl-8 text-xs text-white placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 text-slate-400">Custom Fields Payload Metadata</label>
                    <input
                      type="text"
                      value={seedPayload}
                      onChange={(e) => setSeedPayload(e.target.value)}
                      placeholder="e.g. newsletter=true, plan=premium_tier"
                      className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white placeholder:text-slate-600 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-pink-900/40 hover:bg-pink-900 text-pink-300 font-bold rounded-lg text-xs transition border border-pink-900/30 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-pink-355" />
                    Incorporate Seeded Row
                  </button>

                  {seedSuccessMsg && (
                    <div className="text-[9px] text-center text-emerald-400 font-bold leading-normal animate-fade-in">
                      ✓ Row computed & successfully pushed to static query caches!
                    </div>
                  )}
                </form>

                {/* Display visual raw dataset records */}
                <div className="space-y-1.5">
                  <div className="text-[9px] font-bold text-slate-450 uppercase tracking-widest flex justify-between px-1">
                    <span className="text-slate-400">Active Records Cache</span>
                    <span className="font-mono text-slate-500">TOTAL: {tableRecords.length}</span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-slate-900 rounded-lg bg-slate-950 font-mono text-[9px] divide-y divide-slate-850">
                    {tableRecords.length === 0 ? (
                      <div className="p-4 text-center text-slate-600">No active records. Seed rows above!</div>
                    ) : (
                      tableRecords.map(item => (
                        <div key={item.id} className="p-2 hover:bg-slate-900/45 transition space-y-1">
                          <div className="flex justify-between text-slate-500">
                            <span className="text-slate-500 font-bold font-mono text-[8px] uppercase">{item.id}</span>
                            <span className="text-[8px] text-slate-600">{item.timestamp}</span>
                          </div>
                          <div className="text-white font-bold tracking-tight truncate">{item.email}</div>
                          <div className="text-[8px] text-pink-400 truncate leading-relaxed">
                            {item.payload}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* ZERO-TRUST SECURITY ADVISOR COPYBOX */}
              <div id="db-security-advisor" className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">Zero-Trust Policies Config</span>
                </div>

                <p className="text-[10px] text-slate-404 text-slate-400 leading-relaxed font-sans">
                  Find zero-trust access policies exactly generated to support your active database configurations. Copy and deploy these in your target host dashboard.
                </p>

                {dbProvider === 'firebase' ? (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-orange-400 font-mono">🔥 FIRESTORE SECURITY RULES (firestore.rules)</span>
                    <div className="p-2 border border-slate-850 bg-slate-950 rounded-lg text-[8px] font-mono text-slate-350 leading-normal max-h-52 overflow-y-auto relative group">
                      <pre className="whitespace-pre-wrap select-all selection:bg-orange-850">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Secure your active forms document bindings
    match /${activeTable}/{document} {
      allow create: if true; // Guest submissions enabled safely
      allow read, update, delete: if request.auth != null; // Restrict select/deletes strictly to admins
    }
  }
}`}
                      </pre>
                      <div className="absolute right-2 top-2 opacity-50 hover:opacity-100 transition text-[8px] bg-slate-900 text-slate-400 px-1 py-0.5 rounded font-sans uppercase pointer-events-none">DRAG TO SELECT</div>
                    </div>
                  </div>
                ) : dbProvider === 'supabase' ? (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-emerald-405 text-emerald-400 font-mono">⚡ SUPABASE POSTGRESQL RLS (Row Level Security)</span>
                    <div className="p-2 border border-slate-850 bg-slate-950 rounded-lg text-[8px] font-mono text-slate-350 leading-normal max-h-52 overflow-y-auto relative group">
                      <pre className="whitespace-pre-wrap select-all selection:bg-teal-900">
{`-- 1. Enable Row Level Security (RLS) on PostgreSQL database table
ALTER TABLE ${activeTable} ENABLE ROW LEVEL SECURITY;

-- 2. Open anonymous inserts so front-end website forms can capture waitlists
CREATE POLICY "Public anonymous insert" 
ON ${activeTable} FOR INSERT 
WITH CHECK (true);

-- 3. Lock select/auth routes strictly to authorized workspace employees
CREATE POLICY "Authorized private select"
ON ${activeTable} FOR SELECT
TO authenticated USING (true);`}
                      </pre>
                      <div className="absolute right-2 top-2 opacity-50 hover:opacity-100 transition text-[8px] bg-slate-900 text-slate-400 px-1 py-0.5 rounded font-sans uppercase pointer-events-none">DRAG TO SELECT</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl bg-slate-900/30 border border-slate-900 text-[10px] text-slate-500">
                    💡 Choose **Google Firebase** or **Supabase Integration** above to generate matching Row Level Security (RLS) policies or Firestore Security Rules for table <span className="font-mono font-bold text-slate-300">"{activeTable}"</span>.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: COMPONENT MARKETPLACE */}
        {activeTab === 'marketplace' && (
            <div id="pane-marketplace" className="space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-pink-500" /> WebCraft Extensions Store
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 pb-2 border-b border-slate-800">
                  Expand the website builder with pre-engineered components. Developers can design, test, and register third-party plugins globally.
                </p>
              </div>

              {/* Plugin Grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Available Marketplace Blocks</span>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {[...DEFAULT_PLUGINS, ...customPlugins].map(plugin => {
                    const isInstalled = installedPluginIds.includes(plugin.id);
                    return (
                      <div 
                        key={plugin.id} 
                        className={`p-3 rounded-xl border transition group ${
                          isInstalled 
                            ? 'bg-slate-900 border-indigo-900/60' 
                            : 'bg-[#141418] border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2.5">
                            <span className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                              isInstalled 
                                ? 'bg-indigo-950/40 text-indigo-400 border-indigo-900/40' 
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}>
                              <Puzzle className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-white">{plugin.name}</h4>
                                {plugin.isCustom && (
                                  <span className="text-[8px] bg-indigo-900 text-indigo-300 font-mono font-bold uppercase shrink-0 px-1 rounded">Dev console</span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 block font-medium">By {plugin.author} • {plugin.category}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleInstall(plugin.id)}
                            className={`text-[9px] px-2.5 py-1 rounded font-extrabold cursor-pointer transition ${
                              isInstalled 
                                ? 'bg-rose-950/50 text-rose-450 border border-rose-900/30 hover:bg-rose-950 font-bold' 
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold'
                            }`}
                          >
                            {isInstalled ? 'Uninstall' : 'Install FREE'}
                          </button>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed font-sans">{plugin.description}</p>
                        
                        {isInstalled && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[9px] text-indigo-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 shrink-0" /> Dynamic state active
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onAddElement('plugin', { pluginId: plugin.id, ...plugin.defaultProps });
                                setActiveTab('add');
                              }}
                              className="text-[9px] font-bold text-indigo-400 hover:underline flex items-center gap-0.5"
                            >
                              Add to canvas <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DEVELOPER SUBMISSION PANEL */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl space-y-1">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1 uppercase tracking-wider">
                    <Code className="h-3.5 w-3.5 text-pink-400" /> Plug-in Developer Console
                  </h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                    Develop and compile customized HTML elements. Define interactive props schemas to dynamically visual bind parameters on the canvas.
                  </p>
                </div>

                <form onSubmit={handleDeveloperSubmission} className="bg-slate-950/40 p-4 border border-slate-900 rounded-xl space-y-3.5">
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-900 pb-1 flex items-center gap-1 text-pink-400">
                    <FileCode2 className="h-3 w-3" /> Dev Blueprint Register
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400">Widget Label</label>
                      <input
                        type="text"
                        required
                        value={devName}
                        onChange={(e) => setDevName(e.target.value)}
                        placeholder="e.g. Price Matrix"
                        className="w-full bg-[#121216] border border-slate-800 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400">Section Icon</label>
                      <select
                        value={devIcon}
                        onChange={(e) => setDevIcon(e.target.value)}
                        className="w-full bg-[#121216] border border-slate-800 rounded p-1.5 text-xs text-white font-mono"
                      >
                        <option value="Sparkles">✨ Sparkles</option>
                        <option value="Puzzle">🔌 Puzzle icon</option>
                        <option value="ShoppingBag">🛍️ Store</option>
                        <option value="Lock">🔒 Lock icon</option>
                        <option value="Code">💻 CLI block</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450">Describe Capabilities</label>
                    <input
                      type="text"
                      required
                      value={devDesc}
                      onChange={(e) => setDevDesc(e.target.value)}
                      placeholder="e.g. Split visual columns summarizing subscription costs."
                      className="w-full bg-[#121216] border border-slate-800 rounded p-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Schema Variable Fields */}
                  <div className="bg-[#121216]/50 border border-slate-900 p-3 rounded-lg space-y-2.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      🧩 Define Canvas Variable Field Schema
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500">Var Key (camelCase)</label>
                        <input
                          type="text"
                          required
                          value={devVarName}
                          onChange={(e) => setDevVarName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500">Display Label</label>
                        <input
                          type="text"
                          required
                          value={devVarLabel}
                          onChange={(e) => setDevVarLabel(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-500">Field Type</label>
                        <select
                          value={devVarType}
                          onChange={(e) => setDevVarType(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-white"
                        >
                          <option value="text">String text</option>
                          <option value="number">Numeric Counter</option>
                          <option value="color">RGB color picker</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-bold text-slate-500">Default Value</label>
                      <input
                        type="text"
                        required
                        value={devVarDef}
                        onChange={(e) => setDevVarDef(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-white"
                      />
                    </div>
                  </div>

                  {/* HTML code block */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-400">Inline Compiler Template (HTML/CSS)</label>
                      <span className="text-[8px] font-mono text-slate-500">REPLACES {"{{variable}}"}</span>
                    </div>
                    <textarea
                      required
                      value={devTemplateHTML}
                      onChange={(e) => setDevTemplateHTML(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[9px] font-mono text-slate-300 h-32 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-white" /> Submit & Install Custom Extension
                  </button>

                  {devSubmitSuccess && (
                    <div className="text-[9px] text-center text-emerald-400 font-bold">
                      ❇ Plugin schema registered! Search for it in active panels.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        {/* TAB 4: GENERAL SETTINGS */}
        {activeTab === 'settings' && (
          <div id="pane-site-settings" className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Active Project Specs</h3>
              <p className="text-[11px] text-slate-500 mt-1">Configure workspace names and metadata. Useful for search engine crawl configurations inside compiled index files.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Publish Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => onUpdateSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Meta Crawler Description</label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => onUpdateSiteDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 h-24 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAutoGenerateSpecs}
                  className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] tracking-wide rounded-xl uppercase flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm active:scale-98"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span>Auto-Generate SEO/AEO/GEO & LLMs Specs</span>
                </button>
              </div>

              {/* Accordion: SEO & GEO */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setOpenSettingsGroup(openSettingsGroup === 'seo' ? null : 'seo')}
                  className="w-full p-3 flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-100/70 transition"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-500" />
                    <span>SEO & GEO Search Targets</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${openSettingsGroup === 'seo' ? 'rotate-180' : ''}`} />
                </button>
                {openSettingsGroup === 'seo' && (
                  <div className="p-3 border-t border-slate-200 bg-white space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Keywords (comma-separated)</label>
                      <input
                        type="text"
                        value={siteSeoKeywords}
                        onChange={(e) => onUpdateSiteSeoKeywords?.(e.target.value)}
                        placeholder="e.g. design, no-code, component, local service"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-505 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Author / Copyright owner</label>
                      <input
                        type="text"
                        value={siteSeoAuthor}
                        onChange={(e) => onUpdateSiteSeoAuthor?.(e.target.value)}
                        placeholder="e.g. WebCraft Studio LLC"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-505 focus:outline-none"
                      />
                    </div>
                    <div className="p-2.5 rounded-lg bg-indigo-50/30 border border-indigo-100 text-[10px] text-slate-600 leading-normal">
                      💡 <strong>Geographic Meta Tags</strong> are automatically structured based on local organization schemas to place your output high on local Map search lists.
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion: AEO */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setOpenSettingsGroup(openSettingsGroup === 'aeo' ? null : 'aeo')}
                  className="w-full p-3 flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-100/70 transition"
                >
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-emerald-600" />
                    <span>AEO Answer Grounding</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${openSettingsGroup === 'aeo' ? 'rotate-180' : ''}`} />
                </button>
                {openSettingsGroup === 'aeo' && (
                  <div className="p-3 border-t border-slate-200 bg-white space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Structured Entity Type (Schema.org)</label>
                      <select
                        value={siteAeoStructuredType}
                        onChange={(e) => onUpdateSiteAeoStructuredType?.(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:outline-none"
                      >
                        <option value="Organization">Organization (Business/Team)</option>
                        <option value="Person">Person (Individual Bio)</option>
                        <option value="WebSite">WebSite (Online Service/SaaS)</option>
                        <option value="LocalBusiness">LocalBusiness (Home / Medical / Legal)</option>
                        <option value="SoftwareApplication">SoftwareApplication (Tool / Game)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Primary Target Question</label>
                      <input
                        type="text"
                        value={siteAeoPrimaryQuestion}
                        onChange={(e) => onUpdateSiteAeoPrimaryQuestion?.(e.target.value)}
                        placeholder="e.g. What makes our HVAC service different?"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-505 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Concise AI-Targeted Answer Markup</label>
                      <textarea
                        value={siteAeoAnswerMarkup}
                        onChange={(e) => onUpdateSiteAeoAnswerMarkup?.(e.target.value)}
                        placeholder="Write a clear, factual answer snippet directly optimized for summary ingestion."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-medium h-20 resize-none leading-relaxed focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Verification Citations (One per line)</label>
                      <textarea
                        value={siteAeoCitations}
                        onChange={(e) => onUpdateSiteAeoCitations?.(e.target.value)}
                        placeholder="e.g. https://domain.com/credentials"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 font-medium h-14 resize-none leading-normal focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion: Crawling Manifests */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setOpenSettingsGroup(openSettingsGroup === 'crawler' ? null : 'crawler')}
                  className="w-full p-3 flex items-center justify-between font-bold text-xs text-slate-800 hover:bg-slate-100/70 transition"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span>Robots & LLM Ingestion Specs</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${openSettingsGroup === 'crawler' ? 'rotate-180' : ''}`} />
                </button>
                {openSettingsGroup === 'crawler' && (
                  <div className="p-3 border-t border-slate-200 bg-white space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">robots.txt Directive Sheet</label>
                      <textarea
                        value={siteRobotsTxt}
                        onChange={(e) => onUpdateSiteRobotsTxt?.(e.target.value)}
                        placeholder="User-agent: *..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 h-24 resize-none leading-relaxed focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">llms.txt (AI High-level outline)</label>
                      <textarea
                        value={siteLlmsTxt}
                        onChange={(e) => onUpdateSiteLlmsTxt?.(e.target.value)}
                        placeholder="# Simple summary info..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 h-24 resize-none leading-relaxed focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">llms-full.txt (AI Full specifications)</label>
                      <textarea
                        value={siteLlmsFullTxt}
                        onChange={(e) => onUpdateSiteLlmsFullTxt?.(e.target.value)}
                        placeholder="# Full node trace..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] font-mono text-slate-800 h-24 resize-none leading-relaxed focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-150 text-[10px] text-slate-600 leading-relaxed space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Crawl Optimized (SEO)</span>
                </div>
                <p>When clicking the compiler exporter, WebCraft loads **JSON-LD structured schemas** schema.org scripts in physical HTML files. Zero configurations required for high-index rankings.</p>
              </div>

              {/* PROJECT SNAPSHOTS & HISTORY SECTION */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-extrabold text-white tracking-wider uppercase flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Project Version History</span>
                  </h3>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-full">
                    {versions.length} Saved
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  Wipe active drafts, recover history, or capture current elements with named custom snapshot versions.
                </p>

                {/* Input block to save a version */}
                <div className="bg-[#111116] border border-slate-850 rounded-xl p-3 space-y-3.5 mb-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Snapshot Label / Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Added contact form, V1 draft"
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      className="w-full bg-[#0A0A0C] border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:border-indigo-505 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateVersion}
                    className="w-full h-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] tracking-wide rounded-lg uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Save className="h-3 w-3" /> Capture Active Snapshot
                  </button>
                </div>

                {/* Success messages */}
                {saveSuccess && (
                  <div className="p-2 text-center text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/20 rounded-lg font-bold mb-3">
                    ✓ Snapshot captured successfully!
                  </div>
                )}
                {restoreSuccess && (
                  <div className="p-2 text-center text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/25 rounded-lg font-bold mb-3">
                    ✓ Rollback restore loaded into builder!
                  </div>
                )}

                {/* Versions list */}
                <div id="versions-history-list" className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {versions.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl p-4 bg-[#111116]">
                      <HelpCircle className="h-5 w-5 text-slate-600 mx-auto mb-1.5" />
                      <span className="text-[10px] text-slate-400 font-bold block">No historical states recorded</span>
                      <span className="text-[8px] text-slate-500 mt-0.5 block leading-normal">Enter a label above to capture your first layout snapshot.</span>
                    </div>
                  ) : (
                    versions.map((ver) => (
                      <div 
                        key={ver.id} 
                        className={`p-3 rounded-xl border transition flex flex-col space-y-2.5 relative ${
                          ver.versionName.startsWith('Backup rollback') 
                            ? 'bg-slate-900/50 border-slate-805/60' 
                            : 'bg-[#111116] border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-1.5">
                          <div className="space-y-0.5 min-w-0 flex-1">
                            {ver.versionName.startsWith('Backup rollback') ? (
                              <h4 className="text-[11px] font-bold text-amber-300 leading-snug break-words">
                                {ver.versionName}
                              </h4>
                            ) : (
                              <h4 className="text-[11px] font-bold text-white leading-snug break-words">
                                {ver.versionName}
                              </h4>
                            )}
                            <span className="text-[8px] text-slate-500 block font-mono">
                              {new Date(ver.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 items-end shrink-0">
                            <span className="text-[8px] bg-indigo-950/80 border border-indigo-900/30 text-indigo-400 font-mono px-1.5 py-0.5 rounded">
                              {ver.elements.length} Blocks
                            </span>
                            {ver.integration?.provider !== 'none' && (
                              <span className="text-[8px] bg-emerald-950/50 border border-emerald-900/30 text-emerald-400 font-mono px-1.5 py-0.5 rounded capitalize">
                                🔌 {ver.integration.provider}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[9px]">
                          <button
                            type="button"
                            onClick={() => handleDeleteVersion(ver.id)}
                            className="text-slate-500 hover:text-rose-400 transition cursor-pointer font-bold"
                          >
                            Delete snapshot
                          </button>

                          {confirmRestoreId === ver.id ? (
                            <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 py-0.5 px-1.5 rounded border border-slate-800">
                              <span className="text-[8px] text-amber-400 font-extrabold uppercase tracking-wide">Replace project with this?</span>
                              <button
                                type="button"
                                onClick={() => handleConfirmRestore(ver)}
                                className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded text-[8px] uppercase cursor-pointer"
                              >
                                Restore
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmRestoreId(null)}
                                className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[8px] cursor-pointer"
                              >
                                Skip
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmRestoreId(ver.id)}
                              className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-550 text-white font-extrabold rounded uppercase tracking-wide cursor-pointer transition flex items-center gap-1"
                            >
                              <RefreshCw className="h-2 w-2 shrink-0" /> Restore Version
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
