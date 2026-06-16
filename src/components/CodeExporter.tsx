import React, { useState } from 'react';
import { ElementInstance, DbProvider, FirebaseConfig, SupabaseConfig } from '../types';
import { Download, Copy, Check, FileCode, Shield, Layers, Server } from 'lucide-react';
import { DEFAULT_PLUGINS } from '../templates';

interface CodeExporterProps {
  elements: ElementInstance[];
  siteName: string;
  siteDescription: string;
  dbProvider: DbProvider;
  firebaseConfig: FirebaseConfig;
  supabaseConfig: SupabaseConfig;
  seoKeywords?: string;
  seoAuthor?: string;
  aeoStructuredType?: string;
  aeoPrimaryQuestion?: string;
  aeoAnswerMarkup?: string;
  aeoCitations?: string;
  robotsTxt?: string;
  llmsTxt?: string;
  llmsFullTxt?: string;
}

export default function CodeExporter({
  elements,
  siteName,
  siteDescription,
  dbProvider,
  firebaseConfig,
  supabaseConfig,
  seoKeywords = '',
  seoAuthor = '',
  aeoStructuredType = 'Organization',
  aeoPrimaryQuestion = '',
  aeoAnswerMarkup = '',
  aeoCitations = '',
  robotsTxt = '',
  llmsTxt = '',
  llmsFullTxt = ''
}: CodeExporterProps) {
  const [copied, setCopied] = useState(false);
  const [selectedFileTab, setSelectedFileTab] = useState<'index.html' | 'robots.txt' | 'llms.txt' | 'llms-full.txt'>('index.html');

  // Compile the visual layout & db integrations into standalone raw HTML/JS content
  const compileWebsiteToHTML = (): string => {
    // Generate inner body HTML for components
    const bodyHTML = elements.map(el => {
      switch (el.type) {
        case 'header': {
          const { logoText = '✦ Brand', links = [], style = {} } = el.props;
          return `
    <!-- Header Block -->
    <header class="w-full ${style.bgColor || 'bg-slate-900'} ${style.textColor || 'text-white'} py-5 px-8 transition duration-150">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="text-2xl font-bold tracking-tight">${logoText}</div>
        <nav class="flex space-x-6 items-center">
          ${links.map((link: any) => `
          <a href="${link.href}" class="text-sm font-medium hover:opacity-80 transition">${link.label}</a>
          `).join('')}
          <div class="auth-status-panel hidden flex items-center gap-3">
            <span class="text-xs font-mono bg-white/20 text-white px-2 py-1 rounded auth-email-indicator"></span>
            <button onclick="triggerAuthLogout()" class="text-xs font-semibold py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">Sign Out</button>
          </div>
          <div class="guest-status-panel flex items-center gap-2">
            <button onclick="toggleAuthModal()" class="text-xs font-semibold hover:opacity-85 text-white underline transition">Member Login</button>
          </div>
        </nav>
      </div>
    </header>
          `;
        }

        case 'hero': {
          const { title = '', subtitle = '', buttonText = '', buttonLink = '#', imageUrl = '', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'text-center items-center' : 'text-left items-start';
          const titleAlignment = style.alignment === 'center' ? 'justify-center mx-auto' : '';
          return `
    <!-- Hero Block -->
    <section class="w-full ${style.paddingY || 'py-20'} ${style.paddingX || 'px-8'} ${style.bgColor || 'bg-slate-50'} ${style.textColor || 'text-slate-800'}">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="flex flex-col space-y-6 ${alignClass}">
          <h1 class="text-4xl md:text-5.5xl font-extrabold tracking-tight leading-tight">${title}</h1>
          <p class="text-lg opacity-85 leading-relaxed">${subtitle}</p>
          ${buttonText ? `
          <a href="${buttonLink}" class="inline-block px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition text-center shadow-md active:scale-95 duration-100">${buttonText}</a>
          ` : ''}
        </div>
        <div class="w-full h-96 rounded-2xl overflow-hidden shadow-md">
          <img src="${imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'}" alt="Presentation" class="w-full h-full object-cover" />
        </div>
      </div>
    </section>
          `;
        }

        case 'title': {
          const { text = '', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
          let fsClass = 'text-3xl';
          if (style.fontSize === 'lg') fsClass = 'text-2xl';
          else if (style.fontSize === 'xl') fsClass = 'text-3xl';
          else if (style.fontSize === '2xl') fsClass = 'text-4xl';
          else if (style.fontSize === '3xl') fsClass = 'text-5xl';

          return `
    <!-- Heading Division -->
    <div class="w-full ${style.paddingY || 'py-6'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${style.textColor || 'text-slate-900'} ${alignClass} font-bold tracking-tight ${fsClass}">
      <div class="max-w-6xl mx-auto">${text}</div>
    </div>
          `;
        }

        case 'text': {
          const { content = '', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
          let fsClass = 'text-base';
          if (style.fontSize === 'xs') fsClass = 'text-xs';
          else if (style.fontSize === 'sm') fsClass = 'text-sm';
          else if (style.fontSize === 'lg') fsClass = 'text-lg';

          return `
    <!-- Body Paragraph -->
    <div class="w-full ${style.paddingY || 'py-4'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${style.textColor || 'text-slate-700'} ${alignClass} ${fsClass}">
      <div class="max-w-3xl mx-auto leading-relaxed whitespace-pre-wrap">${content}</div>
    </div>
          `;
        }

        case 'image': {
          const { url = '', alt = 'Graphic', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'mx-auto' : style.alignment === 'right' ? 'ml-auto mr-0' : 'mr-auto ml-0';
          return `
    <!-- Graphic Image Block -->
    <div class="w-full ${style.paddingY || 'py-6'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'}">
      <div class="max-w-4xl rounded-2xl overflow-hidden shadow-sm ${alignClass}">
        <img src="${url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'}" alt="${alt}" class="w-full object-cover h-auto" />
      </div>
    </div>
          `;
        }

        case 'button': {
          const { text = 'Click Me', link = '#', actionType = 'link', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
          
          let onclickAttribute = '';
          if (actionType === 'auth_login' || actionType === 'auth_signup') {
            onclickAttribute = 'onclick="toggleAuthModal()"';
          } else if (actionType === 'auth_logout') {
            onclickAttribute = 'onclick="triggerAuthLogout()"';
          }

          return `
    <!-- Visual Button Element -->
    <div class="w-full ${style.paddingY || 'py-4'} ${style.paddingX || 'px-6'} ${style.bgColor || 'transparent'} ${alignClass}">
      <div class="max-w-6xl mx-auto">
        <a href="${actionType === 'link' ? link : 'javascript:void(0)'}" ${onclickAttribute} class="inline-block px-6 py-2.5 font-semibold text-sm transition text-center shadow-sm hover:opacity-90 active:scale-95 duration-100 ${style.btnBgColor || 'bg-indigo-600'} ${style.btnTextColor || 'text-white'} ${style.borderRadius || 'rounded-md'}">${text}</a>
      </div>
    </div>
          `;
        }        case 'features': {
          const { title = '', items = [], columns = 3, style = {}, layout = 'grid' } = el.props;
          
          if (layout === 'bento') {
            return `
    <!-- Bento-Grid Layout Highlights -->
    <section class="w-full ${style.paddingY || 'py-16'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-slate-950'} ${style.textColor || 'text-white'} border border-slate-900 rounded-3xl my-8 relative overflow-hidden">
      <div class="max-w-6xl mx-auto">
        ${title ? `
        <div class="text-center mb-12">
          <span class="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">Bento Architecture</span>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-3">${title}</h2>
        </div>
        ` : ''}
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${items.map((item: any, idx: number) => {
            const isColSpan2 = idx === 0 || idx === 3;
            const colSpanClass = isColSpan2 ? 'md:col-span-2' : 'md:col-span-1';
            
            const bgOverlay = idx === 0 
              ? '<div class="absolute -right-20 -top-20 w-44 h-44 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>' 
              : idx === 3 
                ? '<div class="absolute -left-20 -bottom-20 w-44 h-44 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>' 
                : '';
                
            const footerHtml = !isColSpan2 
              ? `<div class="mt-6 pt-3 border-t border-slate-900 flex justify-between items-center">
                  <span class="text-[10px] font-mono text-indigo-400">STATUS: ACTIVE</span>
                  <span class="text-[10px] font-mono text-slate-500">99.98% SLA</span>
                 </div>`
              : `<div class="mt-6 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    <span class="text-[10px] font-mono">Live Telemetry Channel</span>
                  </span>
                 </div>`;

            return `
          <div class="bg-[#111116] border border-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition duration-300 hover:border-indigo-500/40 hover:translate-y-[-4px] ${colSpanClass}">
            ${bgOverlay}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="h-8 w-8 bg-indigo-950/80 text-indigo-400 border border-indigo-900/25 rounded-lg flex items-center justify-center font-bold text-xs">${idx + 1}</div>
                <span class="text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">${isColSpan2 ? 'Interactive Showcase' : 'Core Stat'}</span>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-bold text-white tracking-tight">${item.title || 'Feature Title'}</h3>
                <p class="text-slate-400 text-xs leading-relaxed">${item.desc || 'Provide explanatory feature outline text.'}</p>
              </div>
            </div>
            ${footerHtml}
          </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
            `;
          }

          const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';
          return `
    <!-- Feature Highlights Grid -->
    <section class="w-full ${style.paddingY || 'py-16'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-slate-50'} ${style.textColor || 'text-slate-855'}">
      <div class="max-w-6xl mx-auto">
        ${title ? `<h2 class="text-3xl font-bold tracking-tight text-center mb-12">${title}</h2>` : ''}
        <div class="grid grid-cols-1 ${gridCols} gap-8">
          ${items.map((item: any, idx: number) => `
          <div class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col space-y-3 hover:translate-y-[-2px] transition duration-200">
            <div class="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">${idx + 1}</div>
            <h3 class="font-bold text-slate-900 text-base">${item.title}</h3>
            <p class="text-slate-500 text-sm leading-relaxed">${item.desc}</p>
          </div>
          `).join('')}
        </div>
      </div>
    </section>
          `;
        }

        case 'form': {
          const { title = 'Form Capture', fields = [], submitButtonText = 'Submit', targetTable = 'emails', style = {} } = el.props;
          return `
    <!-- Dynamic Client DB-Bound Form -->
    <section class="w-full ${style.paddingY || 'py-16'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-white'} ${style.textColor || 'text-slate-800'}">
      <div class="max-w-md mx-auto p-8 rounded-2xl border border-slate-200 ${style.formBgColor || 'bg-slate-50'} shadow-sm">
        <h3 class="text-2xl font-bold text-slate-900 tracking-tight mb-2">${title}</h3>
        <p class="text-[10px] text-slate-400 font-mono tracking-wide uppercase mb-6">• Real-time Dynamic Form Bindings Enabled</p>
        
        <form data-target-collection="${targetTable}" class="space-y-4 visual-compiled-form">
          ${fields.map((f: any) => `
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600 block">${f.label} ${f.required ? '<span class="text-rose-500">*</span>' : ''}</label>
            ${f.type === 'textarea' ? `
            <textarea name="${f.name}" placeholder="${f.placeholder}" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-705 placeholder-slate-400 h-24 focus:ring-2 focus:ring-indigo-200 focus:outline-none" ${f.required ? 'required' : ''}></textarea>
            ` : f.type === 'checkbox' ? `
            <div class="flex items-center space-x-2">
              <input type="checkbox" name="${f.name}" class="rounded text-indigo-600 focus:ring-indigo-200 h-4 w-4" ${f.required ? 'required' : ''} />
              <span class="text-xs text-slate-500">${f.label}</span>
            </div>
            ` : `
            <input type="${f.type}" name="${f.name}" placeholder="${f.placeholder}" class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-705 placeholder-slate-400 focus:ring-2 focus:ring-indigo-200 focus:outline-none" ${f.required ? 'required' : ''} />
            `}
          </div>
          `).join('')}

          <button type="submit" class="w-full py-3 px-5 font-semibold text-xs mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
            ${submitButtonText}
          </button>
        </form>
      </div>
    </section>
          `;
        }

        case 'protected': {
          const { title = 'Locked Workspace', message = '', authMode = 'show_if_logged_in', style = {} } = el.props;
          return `
    <!-- Protected Lounge Component (Shield Guarded) -->
    <section class="max-w-4xl mx-auto my-12 ${style.paddingY || 'py-12'} ${style.paddingX || 'px-6'} ${style.bgColor || 'bg-indigo-50/50'} ${style.textColor || 'text-indigo-900'} border-2 border-dashed ${style.borderColor || 'border-indigo-150'} rounded-2xl auth-gate-section" data-auth-gate="${authMode}">
      <div class="max-w-2xl mx-auto flex flex-col items-center text-center space-y-4">
        <div class="h-10 w-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h4 class="font-bold text-xl text-slate-900">${title}</h4>
        <p class="text-sm opacity-85 leading-relaxed">${message}</p>
        <span class="inline-block px-3 py-1 rounded bg-indigo-600 text-[10px] text-white font-mono font-medium uppercase">Secured Verification Level Passed</span>
      </div>
    </section>
          `;
        }

        case 'divider': {
          return `
    <!-- Divider Break -->
    <div class="w-full max-w-6xl mx-auto py-8 flex items-center justify-center">
      <div class="w-1/3 border-b border-slate-200"></div>
      <div class="mx-4 text-xs text-slate-350 tracking-widest font-mono">✦</div>
      <div class="w-1/3 border-b border-slate-200"></div>
    </div>
          `;
        }

        case 'footer': {
          const { copyright = '', style = {} } = el.props;
          const alignClass = style.alignment === 'center' ? 'text-center' : style.alignment === 'right' ? 'text-right' : 'text-left';
          return `
    <!-- Copyright Footer Block -->
    <footer class="w-full ${style.bgColor || 'bg-slate-900'} ${style.textColor || 'text-slate-400'} ${style.paddingY || 'py-10'} px-8 border-t border-white/5 ${alignClass} text-xs font-mono">
      <div class="max-w-7xl mx-auto">
        <p>${copyright}</p>
      </div>
    </footer>
          `;
        }

        case 'auth_form': {
          const { title = 'Secure Account Portal', subtitle = 'Verify authorization key to enter private dashboards', mode = 'login_signup_box' } = el.props;
          return `
    <!-- Secure Membership & Authentication Portal (Web SDK Bindings active) -->
    <section class="w-full py-16 px-6 bg-slate-950 flex justify-center items-center rounded-2xl border border-slate-900 my-8 max-w-sm mx-auto">
      <div class="w-full bg-[#111116] border border-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-slate-350">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-indigo-600 to-emerald-500"></div>
        
        <div class="text-center mb-6 pt-1">
          <div class="mx-auto h-9 w-9 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-full flex items-center justify-center mb-3">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 class="text-md font-bold text-white tracking-tight">${title}</h3>
          <p class="text-[10px] text-slate-400 leading-normal mt-1">${subtitle}</p>
        </div>

        <form id="standalone-content-auth-form" class="space-y-4">
          ${(mode === 'signup' || mode === 'login_signup_box') ? `
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Legal Full Name</label>
            <input type="text" id="standalone-auth-name" placeholder="e.g. Jack Bell" class="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>
          ` : ''}

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Email Address</label>
            <input type="email" id="standalone-auth-email" required placeholder="name@domain.co" class="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Access Password</label>
            <input type="password" id="standalone-auth-password" required minlength="6" placeholder="••••••••••••" class="w-full bg-[#16161B] border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500" />
          </div>

          <button type="submit" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition duration-200 mt-2 flex items-center justify-center gap-1.5 cursor-pointer">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-2-2m2 2l2-2m-2 2V8m-9 3h18" /></svg>
            ${mode === 'signup' ? 'Verify New Register' : mode === 'login_signup_box' ? 'Access Membership' : 'Verify Login Credentials'}
          </button>
        </form>
      </div>
    </section>
    
    <script>
      // Add logic for standalone content inline auth form submission
      setTimeout(() => {
        const customAuthForm = document.getElementById('standalone-content-auth-form');
        if (customAuthForm) {
          customAuthForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('standalone-auth-email').value;
            const pass = document.getElementById('standalone-auth-password').value;
            
            if ("${dbProvider}" === "firebase" && window.authInstance) {
              try {
                const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
                if ("${mode}" === "signup") {
                  await createUserWithEmailAndPassword(window.authInstance, email, pass);
                  alert("✓ Firebase account registered successfully!");
                } else {
                  await signInWithEmailAndPassword(window.authInstance, email, pass);
                  alert("✓ Logged into Firebase successfully!");
                }
              } catch (err) {
                alert("Auth Error: " + err.message);
              }
            } else if ("${dbProvider}" === "supabase" && window.supabaseInstance) {
              try {
                if ("${mode}" === "signup") {
                  const { error } = await window.supabaseInstance.auth.signUp({ email, password: pass });
                  if (error) throw error;
                  alert("✓ Supabase verification mail dispatched!");
                } else {
                  const { error } = await window.supabaseInstance.auth.signInWithPassword({ email, password: pass });
                  if (error) throw error;
                  alert("✓ Logged into Supabase successfully!");
                }
              } catch (err) {
                alert("Auth Error: " + err.message);
              }
            } else {
              onUserSessionChanged({ email: email, uid: "mock-uid-999" });
              alert("✓ Simulation Mode: Success login for " + email);
            }
          });
        }
      }, 500);
    </script>
          `;
        }

        case 'plugin': {
          const pId = el.props.pluginId;
          const prebuilts = DEFAULT_PLUGINS;
          
          let matchingPlugin = prebuilts.find(p => p.id === pId);
          
          if (!matchingPlugin) {
            // Safeguard prebuilt compiles
            if (pId === 'plugin-testimonials') {
              const heading = el.props.heading || 'Delighted Client Testimonials';
              const reviewerName = el.props.reviewerName || 'Marcus Aurelius';
              const quote = el.props.quote || 'WebCraft simplified our visual assets pipelines entirely. Outstanding performance and clean code exports.';
              const bgAccent = el.props.bgColor || '#090710';
              return `
    <section style="background-color: ${bgAccent}" class="w-full py-16 px-8 rounded-2xl text-white border border-slate-800 text-center space-y-6 max-w-4xl mx-auto my-8">
      <span class="text-[10px] font-mono tracking-widest text-indigo-400 uppercase font-bold bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">Approved Client Endorsement</span>
      <h3 class="text-2xl font-bold tracking-tight text-white">${heading}</h3>
      <blockquote class="max-w-2xl mx-auto italic text-sm md:text-md opacity-90 leading-relaxed">
        "${quote}"
      </blockquote>
      <div class="text-xs font-bold text-indigo-400">— ${reviewerName}</div>
    </section>
              `;
            } else if (pId === 'plugin-faq') {
              const heading = el.props.heading || 'Frequently Asked Questions';
              const question = el.props.question || 'Is the final exported website codebase fully open-source and ownable?';
              const answer = el.props.answer || 'Absolutely. You own 100% of the compiled CSS/HTML index files. You can host it free of charge on Vercel, Netlify, Github Pages, or your own local containers.';
              return `
    <section class="w-full py-16 px-6 bg-white border border-slate-200 rounded-3xl max-w-3xl mx-auto my-8">
      <h3 class="text-2xl font-extrabold text-slate-900 text-center mb-8">${heading}</h3>
      <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl">
        <h4 class="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">💡 ${question}</h4>
        <p class="text-xs text-slate-500 leading-relaxed">${answer}</p>
      </div>
    </section>
              `;
            } else if (pId === 'plugin-newsletter') {
              const placeholder = el.props.placeholder || 'Enter business email...';
              const headline = el.props.headline || 'Join Our Private Newsletter mailing list';
              const actionBtn = el.props.actionText || 'Register Now';
              return `
    <section class="w-full py-16 px-8 bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-3xl border border-indigo-900/45 max-w-4xl mx-auto my-8 text-center space-y-5">
      <h3 class="text-2xl font-bold tracking-tight">${headline}</h3>
      <p class="text-xs text-slate-400 max-w-md mx-auto">Receive updates and alpha-build releases. Zero spam guaranteed.</p>
      <div class="max-w-md mx-auto flex gap-2">
        <input type="email" placeholder="${placeholder}" class="flex-1 bg-slate-900/80 border border-indigo-900/50 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        <button class="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer">${actionBtn}</button>
      </div>
    </section>
              `;
            } else if (pId === 'plugin-pricing') {
              const tierName = el.props.tierName || 'Scale Professional';
              const priceCode = el.props.price || '$49/month';
              const perks = el.props.features || 'Dynamic form endpoints, Firestore cloud binding, Supabase row storage, Unlimited bandwidth';
              return `
    <section class="w-full py-16 px-6 border border-slate-200 bg-white rounded-3xl max-w-sm mx-auto my-8">
      <div class="text-center space-y-4">
        <span class="text-[9px] font-mono tracking-wider font-extrabold bg-pink-100 text-pink-700 px-2.5 py-1 rounded-full uppercase">Enterprise Plan</span>
        <h3 class="text-xl font-bold text-slate-900">${tierName}</h3>
        <div class="text-3xl font-extrabold text-indigo-600 tracking-tight">${priceCode}</div>
        <p class="text-[11px] text-slate-400 border-b border-slate-100 pb-4">Billed monthly. Cancel securely at any time.</p>
        <ul class="text-left space-y-2 text-xs text-slate-600 font-medium font-sans">
          ${perks.split(',').map(f => `<li class="flex items-center gap-1.5">✓ ${f.trim()}</li>`).join('')}
        </ul>
        <button class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition mt-4 cursor-pointer">Acquire License Key</button>
      </div>
    </section>
              `;
            }
            
            return '';
          }

          // Compile custom submitted developer plugins using safe replace statements
          let html = matchingPlugin.templateHTML || '';
          matchingPlugin.developerFields.forEach((f: any) => {
            const currentVal = el.props[f.name] !== undefined ? el.props[f.name] : f.defaultValue;
            html = html.replace(new RegExp(`{{${f.name}}}`, 'g'), String(currentVal));
          });
          return `
    <!-- Extension block custom registry: ${matchingPlugin.name} -->
    <div class="w-full overflow-hidden">
      ${html}
    </div>
          `;
        }

        default:
          return '';
      }
    }).join('\n');

    // Database configurations integration definitions
    let initDatabaseSDKStr = '';
    let formActionLogicStr = '';

    if (dbProvider === 'firebase') {
      const dbConfig = firebaseConfig;
      initDatabaseSDKStr = `
  <!-- Firebase web core SDK references -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
    import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
    import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

    const config = {
      apiKey: "${dbConfig.apiKey || 'MOCK_API_KEY_PRESET'}",
      authDomain: "${dbConfig.authDomain || 'my-project.firebaseapp.com'}",
      projectId: "${dbConfig.projectId || 'my-project-id'}",
      storageBucket: "${dbConfig.storageBucket || 'my-project.appspot.com'}",
      messagingSenderId: "${dbConfig.messagingSenderId || '123'}",
      appId: "${dbConfig.appId || '1:123:web:12abc'}"
    };

    const app = initializeApp(config);
    window.dbInstance = getFirestore(app);
    window.authInstance = getAuth(app);

    console.log("🔥 Firestore Engine successfully initialized on target:", config.projectId);
    
    // Core session bindings
    onAuthStateChanged(window.authInstance, (user) => {
      onUserSessionChanged(user);
    });
  </script>
      `;

      formActionLogicStr = `
        try {
          if (window.dbInstance) {
            const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js");
            await addDoc(collection(window.dbInstance, collectionTarget), dataPayload);
            alert("✓ Success! Registered direct response to secure collection [" + collectionTarget + "]");
            formElement.reset();
          } else {
            simulatedLogSubmission(collectionTarget, dataPayload);
          }
        } catch (err) {
          console.error(err);
          alert("Firestore submission error: " + err.message);
        }
      `;
    } else if (dbProvider === 'supabase') {
      const dbConfig = supabaseConfig;
      initDatabaseSDKStr = `
  <!-- Supabase direct client loader CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const url = "${dbConfig.url || 'https://your-project.supabase.co'}";
    const anonKey = "${dbConfig.anonKey || 'eyJhbGciOiJIUzI1Ni...'}"
    
    if (url && anonKey) {
      window.supabaseInstance = supabase.createClient(url, anonKey);
      console.log("⚡ Supabase Engine successfully bound: " + url.substring(0, 20) + "...");
      
      // Sync sessions dynamically
      window.supabaseInstance.auth.onAuthStateChange((event, session) => {
        onUserSessionChanged(session ? session.user : null);
      });
    }
  </script>
      `;

      formActionLogicStr = `
        try {
          if (window.supabaseInstance) {
            const { data, error } = await window.supabaseInstance
              .from(collectionTarget)
              .insert([dataPayload]);
            
            if (error) throw error;
            alert("✓ Success! Logged direct row insert to tables!");
            formElement.reset();
          } else {
            simulatedLogSubmission(collectionTarget, dataPayload);
          }
        } catch (err) {
          console.error(err);
          alert("Supabase Operation error: " + err.message);
        }
      `;
    } else {
      // Local mock defaults
      initDatabaseSDKStr = `
  <!-- Local memory simulation configuration (Development Sandbox) -->
  <script>
    console.log("🔬 Running in isolated frontend container. Database bindings are simulated!");
    window.localLogEntries = [];
  </script>
      `;
      formActionLogicStr = `
        simulatedLogSubmission(collectionTarget, dataPayload);
      `;
    }

    // Combine HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteName || 'Compiled No-Code Page'}</title>
  <meta name="description" content="${siteDescription || 'Visual representation assembled via WebCraft'}">
  ${seoKeywords ? `<meta name="keywords" content="${seoKeywords.replace(/"/g, '&quot;')}">` : ''}
  ${seoAuthor ? `<meta name="author" content="${seoAuthor.replace(/"/g, '&quot;')}">` : ''}
  
  <!-- Geographic (GEO) Metadata for Local Indexing -->
  <meta name="geo.region" content="US-CA" />
  <meta name="geo.placename" content="San Francisco" />
  <meta name="geo.position" content="37.7749;-122.4194" />
  <meta name="ICBM" content="37.7749, -122.4194" />

  <!-- AEO JSON-LD Schema Grounding (Schema.org) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${aeoStructuredType || 'Organization'}",
    "name": "${(siteName || 'WebCraft App').replace(/"/g, '\\"')}",
    "description": "${(siteDescription || 'Visual block system').replace(/"/g, '\\"')}",
    "url": "https://${(siteName || 'app').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.com",
    ${aeoPrimaryQuestion ? `
    "mainEntity": {
      "@type": "Question",
      "name": "${aeoPrimaryQuestion.replace(/"/g, '\\"')}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${(aeoAnswerMarkup || '').replace(/"/g, '\\"').replace(/\n/g, ' ')}"
      }
    }
    ` : ''}
  }
  </script>

  <!-- Embedded Crawler Specifications -->
  ${robotsTxt ? `<!-- robots.txt Content Embedded -->
  <meta name="robots-config" content="${robotsTxt.replace(/"/g, '&quot;')}">` : ''}
  ${llmsTxt ? `<!-- llms.txt Content Embedded -->
  <meta name="llms-config" content="${llmsTxt.replace(/"/g, '&quot;')}">` : ''}
  ${llmsFullTxt ? `<!-- llms-full.txt Content Embedded -->
  <meta name="llms-full-config" content="${llmsFullTxt.replace(/"/g, '&quot;')}">` : ''}
  
  <!-- Standalone responsive vector fonts & CDN styles -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
    }
    h1, h2, h3 {
      font-family: 'Space Grotesk', sans-serif;
    }
    .auth-gate-section {
      transition: all 0.3s ease-in-out;
    }
  </style>

  ${initDatabaseSDKStr}
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen relative flex flex-col justify-between">

  <!-- Main visual components compiled stack -->
  <div class="flex-1 w-full flex flex-col">
    ${bodyHTML}
  </div>

  <!-- Dynamic Security & Membership Authentication Modal -->
  <div id="visual-auth-modal" class="fixed inset-0 bg-slate-950/70 z-50 transition duration-150 hidden flex items-center justify-center p-4 backdrop-blur-xs">
    <div class="bg-white rounded-2xl w-full max-w-sm p-6 border border-slate-200 shadow-xl space-y-4 relative">
      <button onclick="toggleAuthModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-mono text-sm">✕</button>
      
      <div class="border-b border-slate-100 pb-3">
        <h3 class="text-lg font-bold text-slate-900 tracking-tight">Enterprise Membership Portal</h3>
        <p class="text-[11px] text-slate-400 mt-1 uppercase tracking-wider font-mono">Compile Sandbox Engine Active</p>
      </div>

      <!-- Login/Register toggle tabs -->
      <div class="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
        <button id="tab-btn-signin" onclick="switchAuthTab('signin')" class="py-1.5 bg-white text-indigo-600 rounded shadow-xs">Sign In</button>
        <button id="tab-btn-signup" onclick="switchAuthTab('signup')" class="py-1.5 text-slate-600 hover:text-slate-900 rounded">Register</button>
      </div>

      <form id="auth-modal-form" class="space-y-4">
        <div class="space-y-1">
          <label class="text-[11px] font-bold text-slate-600 block">Email Address</label>
          <input type="email" id="auth-email-field" required class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none" placeholder="name@domain.com" />
        </div>
        <div class="space-y-1">
          <label class="text-[11px] font-bold text-slate-600 block">Password Secure</label>
          <input type="password" id="auth-pass-field" required minlength="6" class="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-100 focus:outline-none" placeholder="******" />
        </div>

        <button type="submit" id="auth-submit-btn" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs tracking-wide transition">
          Sign In Target Link
        </button>
      </form>
    </div>
  </div>

  <!-- Dynamic JS compilations logic -->
  <script>
    let activeAuthTab = 'signin';
    let currentSessionUser = null;

    // Toggle Modal Utility
    function toggleAuthModal() {
      const modal = document.getElementById('visual-auth-modal');
      modal.classList.toggle('hidden');
    }

    // Switch Modal Tabs
    function switchAuthTab(tab) {
      activeAuthTab = tab;
      const siBtn = document.getElementById('tab-btn-signin');
      const suBtn = document.getElementById('tab-btn-signup');
      const submitBtn = document.getElementById('auth-submit-btn');

      if (tab === 'signin') {
        siBtn.classList.add('bg-white', 'text-indigo-600', 'shadow-xs');
        suBtn.classList.remove('bg-white', 'text-indigo-600', 'shadow-xs');
        submitBtn.innerText = "Execute Sign In";
      } else {
        suBtn.classList.add('bg-white', 'text-indigo-600', 'shadow-xs');
        siBtn.classList.remove('bg-white', 'text-indigo-600', 'shadow-xs');
        submitBtn.innerText = "Register Member Account";
      }
    }

    // Handle Authentication submittals
    document.getElementById('auth-modal-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email-field').value;
      const pass = document.getElementById('auth-pass-field').value;

      if ("${dbProvider}" === "firebase" && window.authInstance) {
        try {
          if (activeAuthTab === 'signin') {
            const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
            await signInWithEmailAndPassword(window.authInstance, email, pass);
            alert("✓ Authenticated in Firebase successfully!");
          } else {
            const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
            await createUserWithEmailAndPassword(window.authInstance, email, pass);
            alert("✓ User account registered successfully!");
          }
          toggleAuthModal();
        } catch (err) {
          alert("Authentication Error: " + err.message);
        }
      } else if ("${dbProvider}" === "supabase" && window.supabaseInstance) {
        try {
          if (activeAuthTab === 'signin') {
            const { data, error } = await window.supabaseInstance.auth.signInWithPassword({ email, password: pass });
            if (error) throw error;
            alert("✓ Authenticated in Supabase successfully!");
          } else {
            const { data, error } = await window.supabaseInstance.auth.signUp({ email, password: pass });
            if (error) throw error;
            alert("✓ Verification email dispatched successfully!");
          }
          toggleAuthModal();
        } catch (err) {
          alert("Supabase Auth Error: " + err.message);
        }
      } else {
        // Sandbox simulation
        onUserSessionChanged({ email: email, uid: "mock-uid-123456" });
        alert("✓ Sandbox Simulation Success! Registered session mock: " + email);
        toggleAuthModal();
      }
    });

    // Close session
    async function triggerAuthLogout() {
      if ("${dbProvider}" === "firebase" && window.authInstance) {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js");
        await signOut(window.authInstance);
        alert("✓ Authenticated user logged out of Firebase!");
      } else if ("${dbProvider}" === "supabase" && window.supabaseInstance) {
        await window.supabaseInstance.auth.signOut();
        alert("✓ Logged out of Supabase!");
      } else {
        onUserSessionChanged(null);
        alert("✓ Simulated session terminated!");
      }
    }

    // Dynamic state synced watcher for elements wrapped under security rules
    function onUserSessionChanged(user) {
      currentSessionUser = user;

      // Update Nav Indicators
      const authPanels = document.querySelectorAll('.auth-status-panel');
      const guestPanels = document.querySelectorAll('.guest-status-panel');
      const emailLabels = document.querySelectorAll('.auth-email-indicator');

      if (user) {
        authPanels.forEach(p => p.classList.remove('hidden'));
        guestPanels.forEach(p => p.classList.add('hidden'));
        emailLabels.forEach(lbl => lbl.innerText = user.email);
      } else {
        authPanels.forEach(p => p.classList.add('hidden'));
        guestPanels.forEach(p => p.classList.remove('hidden'));
      }

      // Filter all protected layout gates!
      document.querySelectorAll('.auth-gate-section').forEach(section => {
        const gateMode = section.getAttribute('data-auth-gate');
        if (gateMode === 'show_if_logged_in') {
          if (user) {
            section.classList.remove('hidden');
          } else {
            section.classList.add('hidden');
          }
        } else if (gateMode === 'show_if_guest') {
          if (user) {
            section.classList.add('hidden');
          } else {
            section.classList.remove('hidden');
          }
        }
      });
    }

    // Handle standard database-form bindings submit loops
    document.querySelectorAll('form.visual-compiled-form').forEach(formElement => {
      formElement.addEventListener('submit', async (e) => {
        e.preventDefault();
        const collectionTarget = formElement.getAttribute('data-target-collection') || 'submissions';
        
        // Assemble payloads
        const dataPayload = {};
        const inputs = formElement.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          if (input.name) {
            if (input.type === 'checkbox') {
              dataPayload[input.name] = input.checked;
            } else {
              dataPayload[input.name] = input.value;
            }
          }
        });
        
        dataPayload.submittedAt = new Date().toISOString();
        dataPayload.browserAgent = navigator.userAgent;

        ${formActionLogicStr}
      });
    });

    // Mock local logs fallback
    function simulatedLogSubmission(collection, data) {
      console.log("Submit captured locally in Sandbox: collection=" + collection, data);
      alert("❇ Sandbox Submission Logged successfully!\\n\\n[Destination Path]: " + collection + "\\n\\n[Data Payload]:\\n" + JSON.stringify(data, null, 2));
    }

    // Run initial guest synchronization on boot
    onUserSessionChanged(null);
  </script>

</body>
</html>`;
  };

  const codeString = compileWebsiteToHTML();

  const getActiveTabContent = (): string => {
    switch (selectedFileTab) {
      case 'robots.txt':
        return robotsTxt || `# robots.txt generated by WebCraft\nUser-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /admin/\nAllow: /`;
      case 'llms.txt':
        return llmsTxt || `# ${siteName || 'WebCraft App'}\n\n${siteDescription || 'Visual assembled webapp.'}`;
      case 'llms-full.txt':
        return llmsFullTxt || `# ${siteName || 'WebCraft App'} - Detailed Spec\n\n${siteDescription || 'Visual assembled webapp.'}\nLayout blocks: ${elements.length}`;
      default:
        return codeString;
    }
  };

  const activeContentString = getActiveTabContent();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeContentString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const mimeType = selectedFileTab === 'index.html' ? 'text/html' : 'text/plain';
    const blob = new Blob([activeContentString], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    let filename = selectedFileTab;
    if (selectedFileTab === 'index.html') {
      const cleanSlug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'compiled-site';
      filename = `${cleanSlug}.html`;
    }
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="code-exporter-panel" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 flex flex-col h-full justify-between">
      
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="h-9 w-9 bg-indigo-950 text-indigo-400 rounded-lg flex items-center justify-center font-mono">
              <FileCode className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white leading-tight">One-Click Compiler</h2>
              <p className="text-[10px] text-slate-400 font-medium">Standalone HTML, Tailwind CSS, & security clients</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              id="btn-copy-code"
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
              title="Copy compiled raw string"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            
            <button
              id="btn-download-index"
              onClick={handleDownloadFile}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-sm active:scale-95 duration-100"
              title="Download standalone index.html file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Integration indicators info */}
        <div id="integration-summary-box" className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-indigo-400" /> visual layouts stack
            </div>
            <p className="text-xs font-bold text-white tracking-tight">Compiled visual segments</p>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              We parsed {elements.length} layout block blocks into optimized, W3C-valid web sections with fully customized inline styles and responsive spacings.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
              <Server className="h-3.5 w-3.5 text-emerald-400" /> database integration
            </div>
            <p className="text-xs font-bold text-white tracking-tight">
              {dbProvider === 'firebase' ? 'Google Firestore' : dbProvider === 'supabase' ? 'Supabase cloud' : 'Mocks Sandbox Enabled'}
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              {dbProvider === 'none' 
                ? 'Client form submissions will trace locally. Edit bindings in the left settings panel to wire up actual credentials.'
                : 'SDK packages are dynamically initialized via direct CDN nodes. Forms are armed to inject rows instantly upon entry submissions!'}
            </p>
          </div>
        </div>

        {/* Dynamic Code Viewer Block with Tabs */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold block">• BUNDLE EXPORT SHEETS</span>
            <span className="text-[9px] text-xs font-semibold text-indigo-400 capitalize bg-indigo-950/30 px-2 py-0.5 rounded border border-indigo-900/30">Active: {selectedFileTab}</span>
          </div>

          <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-2">
            {(['index.html', 'robots.txt', 'llms.txt', 'llms-full.txt'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedFileTab(tab)}
                className={`px-3 py-1 text-[10px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  selectedFileTab === tab
                    ? 'bg-indigo-650 text-white shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div id="html-code-pre-box" className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 h-64 overflow-y-auto font-mono text-[10px] text-slate-300 leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap select-text">{activeContentString}</pre>
          </div>
        </div>
      </div>

      <div id="exporter-help-note" className="mt-6 border-t border-slate-800 pt-4 text-[10px] text-slate-500 font-mono leading-relaxed flex gap-2">
        <Shield className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
        <span>This compiled code operates entirely client-side. There are absolutely no server dependencies, slow databases, or login subscription boundaries. You can host this file for free on Netlify or GitHub Pages instantly!</span>
      </div>

    </div>
  );
}
