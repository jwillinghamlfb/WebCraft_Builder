import React from 'react';
import { ElementInstance, ElementType } from '../types';
import { ChevronUp, ChevronDown, Trash2, Database, Shield, Image as ImageIcon, Sparkles, Star, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { DEFAULT_PLUGINS } from '../templates';

interface CanvasProps {
  elements: ElementInstance[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onRemoveElement: (id: string, e: React.MouseEvent) => void;
  onMoveElement: (id: string, direction: 'up' | 'down') => void;
  onAddElement: (type: ElementType) => void;
  dbProvider: string;
}

export default function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onRemoveElement,
  onMoveElement,
  onAddElement,
  dbProvider
}: CanvasProps) {

  // Visual helper to render components based on standard layouts
  const renderCanvasElement = (el: ElementInstance) => {
    const isSelected = selectedElementId === el.id;
    const borderClass = isSelected 
      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0A0A0C]' 
      : 'hover:ring-2 hover:ring-indigo-400/50 hover:ring-offset-1 hover:ring-offset-[#0A0A0C]';

    return (
      <div
        id={`canvas-el-wrapper-${el.id}`}
        key={el.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectElement(el.id);
        }}
        className={`relative transition duration-150 rounded-xl cursor-pointer ${borderClass} overflow-hidden group/canvas p-1 my-3 bg-transparent`}
      >
        {/* Dynamic Controls Overlays on Hover / Selection */}
        <div id={`controls-overlay-${el.id}`} className="absolute top-2 right-2 flex items-center space-x-1.5 opacity-0 group-hover/canvas:opacity-100 transition z-40 bg-slate-900 text-white rounded-lg p-1 shadow-md">
          <span className="text-[10px] font-mono font-bold px-2 uppercase text-indigo-400">
            {el.type}
          </span>
          <button
            id={`btn-move-up-${el.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveElement(el.id, 'up');
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-300"
            title="Move Up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            id={`btn-move-down-${el.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onMoveElement(el.id, 'down');
            }}
            className="p-1 hover:bg-slate-800 rounded text-slate-300"
            title="Move Down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            id={`btn-remove-${el.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveElement(el.id, e);
            }}
            className="p-1 hover:bg-rose-950 hover:text-rose-400 rounded text-slate-300"
            title="Delete Block"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Selected Highlight Badge */}
        {isSelected && (
          <div className="absolute top-2 left-2 z-40 bg-indigo-600 text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase shadow">
            Active Editor Target
          </div>
        )}

        {/* Real Dynamic Component Renderers */}
        <div id={`rendered-content-${el.id}`}>
          {renderInnerComponent(el)}
        </div>
      </div>
    );
  };

  const renderInnerComponent = (el: ElementInstance) => {
    switch (el.type) {
      case 'header': {
        const { logoText = '✦ Brand', links = [], style = {} } = el.props;
        return (
          <header className={`w-full py-4 px-6 flex justify-between items-center ${style.bgColor || 'bg-slate-900'} ${style.textColor || 'text-white'}`}>
            <div className="text-xl font-extrabold tracking-tight">{logoText}</div>
            <nav className="flex space-x-6">
              {links.map((link: any, idx: number) => (
                <span key={idx} className="text-sm font-medium opacity-85 hover:opacity-100 transition">
                  {link.label}
                </span>
              ))}
            </nav>
          </header>
        );
      }

      case 'hero': {
        const { title = '', subtitle = '', buttonText = '', imageUrl = '', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'text-center items-center' : 'text-left items-start';
        return (
          <section className={`w-full ${style.paddingY || 'py-16'} ${style.paddingX || 'px-8'} ${style.bgColor || 'bg-slate-100'} ${style.textColor || 'text-slate-800'}`}>
            <div className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}>
              <div className={`flex flex-col space-y-6 ${alignClass}`}>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  {title || 'Elevate Your Business Visual Core'}
                </h1>
                <p className="text-base md:text-lg opacity-85 leading-relaxed">
                  {subtitle || 'Click to edit header statements, configure margins and attach form action hooks.'}
                </p>
                {buttonText && (
                  <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm transition pointer-events-none">
                    {buttonText}
                  </button>
                )}
              </div>
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md flex items-center justify-center bg-slate-200">
                {imageUrl ? (
                  <img src={imageUrl} alt="Hero representation" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-slate-400" />
                )}
              </div>
            </div>
          </section>
        );
      }

      case 'text': {
        const { content = '', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
        
        let fsClass = 'text-base';
        if (style.fontSize === 'xs') fsClass = 'text-xs';
        else if (style.fontSize === 'sm') fsClass = 'text-sm';
        else if (style.fontSize === 'lg') fsClass = 'text-lg';
        else if (style.fontSize === 'xl') fsClass = 'text-xl';
        else if (style.fontSize === '2xl') fsClass = 'text-2xl';

        return (
          <div className={`w-full ${style.paddingY || 'py-4'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${style.textColor || 'text-slate-700'} ${alignClass} ${fsClass}`}>
            <p className="leading-relaxed whitespace-pre-wrap">{content || 'Double click or edit sidebar content to alter this text body paragraph.'}</p>
          </div>
        );
      }

      case 'title': {
        const { text = '', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
        let fsClass = 'text-3xl';
        if (style.fontSize === 'lg') fsClass = 'text-2xl';
        else if (style.fontSize === 'xl') fsClass = 'text-3xl';
        else if (style.fontSize === '2xl') fsClass = 'text-4xl';
        else if (style.fontSize === '3xl') fsClass = 'text-5xl';

        return (
          <div className={`w-full ${style.paddingY || 'py-4'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${style.textColor || 'text-slate-900'} ${alignClass} font-bold tracking-tight ${fsClass}`}>
            {text || 'Heading Title Section'}
          </div>
        );
      }

      case 'image': {
        const { url = '', alt = 'Visual segment', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'mx-auto' : style.alignment === 'right' ? 'ml-auto mr-0' : 'mr-auto ml-0';
        return (
          <div className={`w-full ${style.paddingY || 'py-6'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'}`}>
            <div className={`max-w-2xl rounded-2xl overflow-hidden shadow-sm flex items-center justify-center bg-slate-200 ${alignClass} max-h-96`}>
              {url ? (
                <img src={url} alt={alt} referrerPolicy="no-referrer" className="w-full object-cover" />
              ) : (
                <ImageIcon className="h-10 w-10 text-slate-400 py-12" />
              )}
            </div>
          </div>
        );
      }

      case 'button': {
        const { text = 'Click Action', actionType = 'link', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
        return (
          <div className={`w-full ${style.paddingY || 'py-4'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${alignClass}`}>
            <button className={`px-6 py-2.5 font-semibold text-sm transition pointer-events-none ${style.btnBgColor || 'bg-indigo-600'} ${style.btnTextColor || 'text-white'} ${style.borderRadius || 'rounded-md'}`}>
              {text} {actionType !== 'link' && `(${actionType.replace('auth_', '').toUpperCase()})`}
            </button>
          </div>
        );
      }

      case 'features': {
        const { title = '', items = [], columns = 3, style = {}, layout = 'grid' } = el.props;
        
        if (layout === 'bento') {
          return (
            <section className={`w-full ${style.paddingY || 'py-16'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-slate-950'} ${style.textColor || 'text-white'} border border-slate-900 rounded-3xl my-6 relative overflow-hidden`}>
              <div className="max-w-6xl mx-auto">
                {title && (
                  <div className="text-center mb-12">
                    <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-black bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">
                      Bento Architecture
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mt-3">{title}</h2>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {items.map((item: any, idx: number) => {
                    const isColSpan2 = idx === 0 || idx === 3;
                    const colSpanClass = isColSpan2 ? 'md:col-span-2' : 'md:col-span-1';
                    
                    return (
                      <div 
                        key={item.id || idx} 
                        className={`bg-[#111116] border border-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition duration-300 hover:border-indigo-505/40 hover:-translate-y-1 ${colSpanClass}`}
                      >
                        {idx === 0 && (
                          <div className="absolute -right-20 -top-20 w-44 h-44 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        )}
                        {idx === 3 && (
                          <div className="absolute -left-20 -bottom-20 w-44 h-44 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="h-8 w-8 bg-indigo-950/80 text-indigo-400 border border-indigo-900/20 rounded-lg flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </div>
                            <span className="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                              {isColSpan2 ? 'Interactive Showcase' : 'Core Stat'}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-white tracking-tight">{item.title || 'Feature Title'}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{item.desc || 'Provide explanatory feature outline text.'}</p>
                          </div>
                        </div>
                        
                        {!isColSpan2 ? (
                          <div className="mt-6 pt-3 border-t border-slate-900 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-indigo-400">STATUS: ACTIVE</span>
                            <span className="text-[10px] font-mono text-slate-500">99.98% SLA</span>
                          </div>
                        ) : (
                          <div className="mt-6 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                              <span className="text-[10px] font-mono">Live Telemetry Channel</span>
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
        return (
          <section className={`w-full ${style.paddingY || 'py-12'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-slate-50'} ${style.textColor || 'text-slate-800'}`}>
            <div className="max-w-6xl mx-auto">
              {title && <h2 className="text-xl md:text-3xl font-bold tracking-tight text-center mb-10">{title}</h2>}
              <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                {items.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-3">
                    <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-slate-900">{item.title || 'Feature Title'}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc || 'Provide explanatory feature outline text.'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'form': {
        const { title = 'Inquiry Registration', fields = [], submitButtonText = 'Submit', targetTable = 'submissions', style = {} } = el.props;
        const boundText = dbProvider !== 'none' 
          ? `⚡ Dynamically Bound: ${dbProvider === 'firebase' ? 'Firestore' : 'Supabase Table'} -> [${targetTable || 'leads'}]`
          : `⚠️ Local Sandbox Mode (Configure DB credentials in 'Integrations' tab)`;

        return (
          <section id={`form-block-${el.id}`} className={`w-full ${style.paddingY || 'py-12'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-white'} ${style.textColor || 'text-slate-800'}`}>
            <div className={`max-w-md mx-auto p-8 rounded-2xl border border-slate-200 ${style.formBgColor || 'bg-slate-50'} shadow-sm`}>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <div className="mt-2 text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-2 py-1 flex items-center gap-1">
                  <Database className="h-3 w-3" /> {boundText}
                </div>
              </div>

              <div className="space-y-4">
                {fields.map((f: any, idx: number) => (
                  <div key={f.id || idx} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 block">
                      {f.label} {f.required && <span className="text-rose-500">*</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 placeholder-slate-400 resize-none h-20"
                        placeholder={f.placeholder}
                        disabled
                      />
                    ) : f.type === 'checkbox' ? (
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded text-indigo-600" disabled />
                        <span className="text-xs text-slate-500">{f.label}</span>
                      </div>
                    ) : (
                      <input
                        type={f.type}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 placeholder-slate-400"
                        placeholder={f.placeholder}
                        disabled
                      />
                    )}
                  </div>
                ))}

                <button className={`w-full py-2.5 font-semibold text-xs mt-3 ${style.btnBgColor || 'bg-indigo-600'} ${style.btnTextColor || 'text-white'} rounded-lg hover:opacity-90 cursor-default flex items-center justify-center gap-1.5`}>
                  <Database className="h-3.5 w-3.5" />
                  {submitButtonText}
                </button>
              </div>
            </div>
          </section>
        );
      }

      case 'protected': {
        const { title = '', message = '', authMode = 'show_if_logged_in', style = {} } = el.props;
        return (
          <section className={`w-full ${style.paddingY || 'py-10'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-indigo-50'} ${style.textColor || 'text-indigo-900'} border-2 border-dashed ${style.borderColor || 'border-indigo-200'} rounded-2xl`}>
            <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-3">
              <div className="h-9 w-9 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-lg text-slate-950">{title || 'Secure Members Area'}</h4>
              <p className="text-xs opacity-90 leading-relaxed max-w-lg">{message}</p>
              <div className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono bg-indigo-600 text-white font-medium">
                🛡️ Auth Condition: {authMode === 'show_if_logged_in' ? 'VISIBLE ONLY TO LOGGED-IN USERS' : 'VISIBLE ONLY TO GUESTS'}
              </div>
            </div>
          </section>
        );
      }

      case 'divider': {
        return (
          <div className="w-full py-6 flex items-center justify-center">
            <div className="w-1/3 border-b-2 border-dashed border-slate-200" />
            <span className="px-3 text-[10px] font-mono text-slate-400 tracking-widest">DIVIDER</span>
            <div className="w-1/3 border-b-2 border-dashed border-slate-200" />
          </div>
        );
      }

      case 'footer': {
        const { copyright = '', style = {} } = el.props;
        const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
        return (
          <footer className={`w-full py-8 px-6 ${style.bgColor || 'bg-slate-900'} ${style.textColor || 'text-slate-400'} ${alignClass} text-xs font-mono`}>
            <div>{copyright || '© 2026 Compile Engine Corp.'}</div>
          </footer>
        );
      }

      case 'auth_form': {
        const { title = 'Secure Account Portal', subtitle = 'Verify authorization key to enter private dashboards', mode = 'login_signup_box', successRedirectUrl = '#dashboard' } = el.props;
        return (
          <section className="w-full py-12 px-6 bg-slate-950 flex justify-center items-center rounded-2xl border border-slate-900">
            <div className="w-full max-w-sm bg-[#111116] border border-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-300">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-indigo-600 to-emerald-500" />
              
              <div className="text-center mb-6 pt-1">
                <div className="mx-auto h-9 w-9 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-full flex items-center justify-center mb-3">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="text-md font-bold text-white tracking-tight">{title}</h3>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">{subtitle}</p>
              </div>

              {/* Mode switch helper tabs */}
              {mode === 'login_signup_box' && (
                <div className="grid grid-cols-2 bg-slate-950 p-1 border border-slate-900 rounded-lg mb-4 text-center text-xs">
                  <div className="py-1 bg-slate-900 text-white font-bold rounded-md">Login Auth</div>
                  <div className="py-1 text-slate-500 cursor-default">Register Account</div>
                </div>
              )}

              <div className="space-y-4">
                {(mode === 'signup' || mode === 'login_signup_box') && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Legal Full Name</label>
                    <input
                      type="text"
                      disabled
                      placeholder="e.g. Jack Bell"
                      className="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Email Address</label>
                  <input
                    type="email"
                    disabled
                    placeholder="name@domain.co"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Access Password</label>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••••••"
                    className="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <button className="w-full py-2 bg-indigo-600 hover:bg-slate-500 text-white font-semibold rounded-lg text-xs transition duration-200 pointer-events-none mt-2 flex items-center justify-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Authenticate Secure Account
                </button>

                <div className="text-[9px] text-center font-mono text-slate-500 border-t border-slate-900/60 pt-3 flex justify-between px-1">
                  <span>Provider: {dbProvider !== 'none' ? dbProvider.toUpperCase() : 'SANDBOX'}</span>
                  <span>Redirects: {successRedirectUrl}</span>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'plugin': {
        const pId = el.props.pluginId;
        // Load custom plugins dynamic list to support developer submission renders
        const customPlugins = (() => {
          try {
            const saved = localStorage.getItem('webcraft_custom_plugins');
            return saved ? JSON.parse(saved) : [];
          } catch {
            return [];
          }
        })();

        const targetPlugin = [...DEFAULT_PLUGINS, ...customPlugins].find(p => p.id === pId);
        if (!targetPlugin) {
          return (
            <div className="p-8 text-center text-xs text-rose-500 bg-slate-900 border border-slate-800 rounded-xl">
              ⚠️ Extension Block uninstalled or not found: ID "{pId}"
            </div>
          );
        }

        // RENDER CUSTOM SUBMITTED THIRD PARTY DIRECTIVES
        if (targetPlugin.isCustom) {
          let html = targetPlugin.templateHTML || '';
          targetPlugin.developerFields.forEach(f => {
            const currentVal = el.props[f.name] !== undefined ? el.props[f.name] : f.defaultValue;
            html = html.replace(new RegExp(`{{${f.name}}}`, 'g'), String(currentVal));
          });
          return (
            <div className="w-full overflow-hidden rounded-xl border border-dashed border-indigo-500/30" dangerouslySetInnerHTML={{ __html: html }} />
          );
        }

        // PRE-BUILT DELUXE PLUGINS DIRECTIVES
        if (pId === 'plugin-testimonials') {
          const heading = el.props.heading || 'Delighted Client Testimonials';
          const reviewerName = el.props.reviewerName || 'Marcus Aurelius';
          const quote = el.props.quote || 'WebCraft simplified our visual assets pipelines entirely. Outstanding performance and clean code exports.';
          const bgAccent = el.props.bgColor || '#090710';
          const starCount = Number(el.props.stars || 5);

          return (
            <section style={{ backgroundColor: bgAccent }} className="w-full py-12 px-8 rounded-2xl text-white border border-slate-800 text-center space-y-6">
              <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">Approved Client Endorsement</span>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight text-white">{heading}</h3>
              
              <div className="flex justify-center text-amber-400 gap-1">
                {Array.from({ length: starCount }).map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="max-w-2xl mx-auto italic text-sm md:text-md opacity-90 leading-relaxed">
                "{quote}"
              </blockquote>

              <div className="space-y-1">
                <span className="text-xs font-bold font-mono tracking-tight text-slate-300 block">{reviewerName}</span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase">Verified Tech Lead & Architect</span>
              </div>
            </section>
          );
        }

        if (pId === 'plugin-faq') {
          const heading = el.props.heading || 'Frequently Asked Queries';
          const openState = el.props.openByDefault === 'True' || el.props.openByDefault === true;
          const question = el.props.question || 'Is the final generated HTML code export lock-in free?';
          const answer = el.props.answer || 'Absolutely! Clicking "Export Source Code" bundles high-contrast tailwind styling, secure client bindings, and responsive structures into a single file with zero dependencies.';

          return (
            <section className="w-full py-12 px-6 bg-slate-900 rounded-2xl border border-slate-800 text-slate-300">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                  <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight">{heading}</h3>
                  <p className="text-[10px] text-slate-500 mt-1">Everything you need to know about WebCraft deployment loops.</p>
                </div>

                <div className="border border-slate-800 bg-[#0F0F12] rounded-xl overflow-hidden p-4 space-y-3">
                  <summary className="font-bold text-xs text-white list-none flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-indigo-400" /> {question}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </summary>
                  
                  {(openState || true) && (
                    <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-900 pt-3 font-sans">
                      {answer}
                    </p>
                  )}
                </div>
              </div>
            </section>
          );
        }

        if (pId === 'plugin-pricing') {
          const planName = el.props.planName || 'Enterprise Plan';
          const cost = el.props.pricingMonthly || '99';
          const featureCount = Number(el.props.benefitAmount || 5);

          return (
            <section className="w-full py-12 px-6 bg-slate-950 rounded-2xl border border-slate-900 text-center">
              <div className="max-w-md mx-auto bg-[#101014] border border-slate-900 p-8 rounded-2xl relative shadow-2xl space-y-6">
                <div className="absolute top-3 right-3 text-[8px] bg-indigo-950 text-indigo-400 font-mono px-2 py-0.5 rounded font-extrabold uppercase">Most Approved</div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-indigo-400">{planName}</h4>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    ${cost}<span className="text-xs text-slate-500 font-semibold">/month</span>
                  </div>
                  <p className="text-[10px] text-slate-405 text-slate-400">Scale SaaS visual frameworks with zero restrictions.</p>
                </div>

                {/* Comparative items list */}
                <ul className="text-left text-xs divide-y divide-slate-900/60 font-sans space-y-2.5 pt-2 border-t border-slate-900/60">
                  {Array.from({ length: featureCount }).map((_, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-350 pt-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Advanced Sandbox Mappings #{idx + 1}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white bg-indigo-600 font-bold rounded-xl text-xs transition duration-200 pointer-events-none cursor-default flex items-center justify-center gap-1.5">
                  Secure Enterprise Gateway
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>
          );
        }

        if (pId === 'plugin-newsletter') {
          const badge = el.props.badgeLabel || 'Early Adopters Alert';
          const mainTitle = el.props.headline || 'Subscribe For Alpha API Drops';

          return (
            <section className="w-full py-12 px-6 bg-[#0E0B16] rounded-2xl border border-slate-900 text-center flex flex-col items-center justify-center space-y-5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-pink-950 text-pink-300 border border-pink-900 px-2.5 py-0.5 rounded-full">{badge}</span>
              
              <div className="max-w-md space-y-1">
                <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white">{mainTitle}</h3>
                <p className="text-[10px] text-slate-400 leading-normal">Become a stakeholder of lock-in-free web code development today.</p>
              </div>

              {/* simulated form input */}
              <div className="w-full max-w-sm flex gap-2">
                <input
                  type="email"
                  disabled
                  placeholder="enter.developer@domain.co"
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-2.5 text-xs text-slate-300 placeholder:text-slate-600 leading-none"
                />
                <button className="px-4 py-2.5 bg-pink-700 hover:bg-pink-650 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 pointer-events-none">
                  Incorporate
                </button>
              </div>
            </section>
          );
        }

        return (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded text-center text-xs text-amber-500">
            Unsupported Default Plugin: {pId}
          </div>
        );
      }

      default:
        return <div className="p-4 text-center text-xs text-rose-500">Unsupported Component type: {el.type}</div>;
    }
  };

  return (
    <div id="canvas-container" className="h-full bg-[#0F0F12] rounded-2xl border border-slate-800 p-6 overflow-y-auto shadow-inner flex flex-col justify-between min-h-[500px]">
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-tight text-slate-400">LIVE WYSIWYG CANVAS</span>
          </div>
          <span className="text-[10px] bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono font-medium">
            Viewport: Desktop (100% Fluid)
          </span>
        </div>

        {elements.length === 0 ? (
          <div id="canvas-empty-state" className="flex flex-col items-center justify-center py-20 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
            <Sparkles className="h-10 w-10 text-slate-700 mb-3" />
            <p className="text-xs font-semibold text-slate-400">Visual canvas is pristine and empty.</p>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-relaxed">Select block primitives from the sidebar to inject headers, dynamic database forms, or members lounges into your site.</p>
          </div>
        ) : (
          <div id="canvas-elements-list" className="space-y-4">
            {elements.map(renderCanvasElement)}
          </div>
        )}
      </div>

      {elements.length > 0 && (
        <div id="canvas-footer-action" className="mt-8 border-t border-slate-800 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>💡 Select any visual element to format copies, colors, and bindings!</span>
          <span>Open-source engine</span>
        </div>
      )}
    </div>
  );
}
