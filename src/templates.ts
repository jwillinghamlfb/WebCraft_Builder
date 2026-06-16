import { Website, ElementInstance, PluginDefinition } from './types';

// Aesthetic preset items
export const SAAS_TEMPLE_ELEMENTS: ElementInstance[] = [
  {
    id: 'header-1',
    type: 'header',
    props: {
      logoText: '✦ VenturFlow',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Integrations', href: '#integrations' },
        { label: 'Waitlist', href: '#waitlist' }
      ],
      style: {
        bgColor: 'bg-slate-900',
        textColor: 'text-white',
        paddingY: 'py-4',
        paddingX: 'px-6'
      }
    }
  },
  {
    id: 'hero-1',
    type: 'hero',
    props: {
      title: 'Automate Business Operations with Zero Code',
      subtitle: 'Build high-converting logical pipelines and bind customer inputs direct to your secure database. Zero infrastructure, zero complexity.',
      buttonText: 'Join Beta Waitlist',
      buttonLink: '#waitlist',
      imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
      style: {
        bgColor: 'bg-slate-900',
        textColor: 'text-slate-100',
        paddingY: 'py-20',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  },
  {
    id: 'features-1',
    type: 'features',
    props: {
      title: 'Engineered for Performance',
      columns: 3,
      items: [
        {
          id: 'f1',
          title: 'Direct Client Bindings',
          desc: 'Submit and validate client-side forms straight to Firestore/Supabase tables securely using zero-trust database rule mappings.',
          iconName: 'Database'
        },
        {
          id: 'f2',
          title: 'One-Click Compile',
          desc: 'Export optimized, dependency-free HTML structure which loads in milliseconds. Absolute code ownership, deploy to any hosting.',
          iconName: 'Zap'
        },
        {
          id: 'f3',
          title: 'Protected State Gates',
          desc: 'Wrap sections in secure login conditions, allowing authenticated customers full visibility of files, logs, and sensitive assets.',
          iconName: 'Lock'
        }
      ],
      style: {
        bgColor: 'bg-slate-50',
        textColor: 'text-slate-900',
        paddingY: 'py-16',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  },
  {
    id: 'protected-segment',
    type: 'protected',
    props: {
      title: '🔒 Verified Member Special Lounge',
      message: 'This section is dynamically guarded. In the compiled site, our client adapter verifies the Firebase / Supabase SDK auth session before making this HTML content visible to the visitor.',
      authMode: 'show_if_logged_in',
      style: {
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-900',
        borderColor: 'border-emerald-200',
        paddingY: 'py-12',
        paddingX: 'px-8',
        borderRadius: 'rounded-lg',
        alignment: 'center'
      }
    }
  },
  {
    id: 'waitlist-form',
    type: 'form',
    props: {
      title: 'Secured Waitlist Registration',
      submitButtonText: 'Register Workspace',
      targetTable: 'subscribers',
      fields: [
        {
          id: 'wf1',
          name: 'companyName',
          label: 'Company Name',
          placeholder: 'Enter company or workspace',
          type: 'text',
          required: true
        },
        {
          id: 'wf2',
          name: 'email',
          label: 'Business Email',
          placeholder: 'name@company.com',
          type: 'email',
          required: true
        },
        {
          id: 'wf3',
          name: 'agreeTerms',
          label: 'I request high-priority onboarding access',
          placeholder: '',
          type: 'checkbox',
          required: true
        }
      ],
      style: {
        bgColor: 'bg-white',
        textColor: 'text-slate-900',
        formBgColor: 'bg-slate-50',
        btnBgColor: 'bg-blue-600',
        btnTextColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8',
        borderRadius: 'rounded-xl'
      }
    }
  },
  {
    id: 'footer-1',
    type: 'footer',
    props: {
      copyright: '© 2026 VenturFlow Technologies Inc. All rights reserved. Self-hosted & Compile Secured.',
      style: {
        bgColor: 'bg-slate-900',
        textColor: 'text-slate-400',
        paddingY: 'py-8',
        paddingX: 'px-6',
        alignment: 'center'
      }
    }
  }
];

export const PORTFOLIO_ELEMENTS: ElementInstance[] = [
  {
    id: 'header-2',
    type: 'header',
    props: {
      logoText: '✎ Elena Diaz',
      links: [
        { label: 'Work', href: '#work' },
        { label: 'Consultation', href: '#contact' }
      ],
      style: {
        bgColor: 'bg-neutral-50',
        textColor: 'text-neutral-900',
        paddingY: 'py-5',
        paddingX: 'px-8'
      }
    }
  },
  {
    id: 'hero-2',
    type: 'hero',
    props: {
      title: 'Architecting Human-Centered Digital Experiences',
      subtitle: 'Senior product designer with 8 years of crafting award-winning SaaS interfaces and user research maps. Based in San Francisco.',
      buttonText: 'Book Dynamic Consult',
      buttonLink: '#contact',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
      style: {
        bgColor: 'bg-white',
        textColor: 'text-neutral-800',
        paddingY: 'py-16',
        paddingX: 'px-8',
        alignment: 'left'
      }
    }
  },
  {
    id: 'portfolio-contact',
    type: 'form',
    props: {
      title: 'Schedule a Project Discovery Session',
      submitButtonText: 'Submit Consultation Request',
      targetTable: 'messages',
      fields: [
        {
          id: 'pf1',
          name: 'clientName',
          label: 'Your Name',
          placeholder: 'Elena Diaz Client',
          type: 'text',
          required: true
        },
        {
          id: 'pf2',
          name: 'email',
          label: 'Email Address',
          placeholder: 'email@design.io',
          type: 'email',
          required: true
        },
        {
          id: 'pf3',
          name: 'projectType',
          label: 'Primary Project Type',
          placeholder: 'SaaS Platform / Mobile App / Dynamic E-Commerce',
          type: 'text',
          required: false
        },
        {
          id: 'pf4',
          name: 'brief',
          label: 'Brief Details',
          placeholder: 'Tell me about the goals of your project...',
          type: 'textarea',
          required: true
        }
      ],
      style: {
        bgColor: 'bg-neutral-50',
        textColor: 'text-neutral-900',
        formBgColor: 'bg-white',
        btnBgColor: 'bg-neutral-900',
        btnTextColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8'
      }
    }
  },
  {
    id: 'footer-2',
    type: 'footer',
    props: {
      copyright: '© 2026 Elena Diaz Portfolio. Synthesized in Web Builder.',
      style: {
        bgColor: 'bg-neutral-900',
        textColor: 'text-neutral-400',
        paddingY: 'py-8',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  }
];

export const SERVICE_ELEMENTS: ElementInstance[] = [
  {
    id: 'header-3',
    type: 'header',
    props: {
      logoText: '🌳 Evergreen Turf Care',
      links: [
        { label: 'Booking', href: '#book' },
        { label: 'Call Us: (555) 321-4490', href: 'tel:5553214490' }
      ],
      style: {
        bgColor: 'bg-emerald-900',
        textColor: 'text-white',
        paddingY: 'py-4',
        paddingX: 'px-6'
      }
    }
  },
  {
    id: 'hero-3',
    type: 'hero',
    props: {
      title: 'Premium Horticultural & Lawn Design',
      subtitle: 'Providing professional lawn care, custom seasonal pruning, and ecological lawn rejuvenation for premium estates since 2011. Local team, fully certified.',
      buttonText: 'Book Your Service Quote',
      buttonLink: '#book',
      imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=1200&auto=format&fit=crop',
      style: {
        bgColor: 'bg-stone-50',
        textColor: 'text-stone-800',
        paddingY: 'py-20',
        paddingX: 'px-8',
        alignment: 'left'
      }
    }
  },
  {
    id: 'features-3',
    type: 'features',
    props: {
      title: 'Lawn Care Protocols We Standardize',
      columns: 3,
      items: [
        {
          id: 'sf1',
          title: 'Soil Nutrient Optimization',
          desc: 'Comprehensive tests mapping PH values, adding ecological organic feeds tailored to local clay types.',
          iconName: 'GlassWater'
        },
        {
          id: 'sf2',
          title: 'Precision Precision Cut',
          desc: 'Strict standard of blade sharpness with specific heights based on seasonal climate humidity.',
          iconName: 'Cut'
        },
        {
          id: 'sf3',
          title: 'Root Aeration & Seeding',
          desc: 'Mechanical aeration cores paired with custom hybrid tall-fescue blends for absolute weed rejection.',
          iconName: 'Flower'
        }
      ],
      style: {
        bgColor: 'bg-white',
        textColor: 'text-stone-900',
        paddingY: 'py-16',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  },
  {
    id: 'book-appointment',
    type: 'form',
    props: {
      title: 'Book a Local Turf Care Appointment',
      submitButtonText: 'Schedule Inspection',
      targetTable: 'appointments',
      fields: [
        {
          id: 'sf1n',
          name: 'customerName',
          label: 'Client Name',
          placeholder: 'Your Full Name',
          type: 'text',
          required: true
        },
        {
          id: 'sf1e',
          name: 'email',
          label: 'Contact Email',
          placeholder: 'name@homeowner.com',
          type: 'email',
          required: true
        },
        {
          id: 'sf1a',
          name: 'address',
          label: 'Property Address',
          placeholder: '123 Meadow Lane, Suburbia',
          type: 'text',
          required: true
        },
        {
          id: 'sf1d',
          name: 'requestedDate',
          label: 'Preferred Date',
          placeholder: 'Select a weekday preference',
          type: 'text',
          required: true
        }
      ],
      style: {
        bgColor: 'bg-stone-100',
        textColor: 'text-stone-900',
        formBgColor: 'bg-white',
        btnBgColor: 'bg-emerald-700',
        btnTextColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8',
        borderRadius: 'rounded-lg'
      }
    }
  },
  {
    id: 'footer-3',
    type: 'footer',
    props: {
      copyright: '© 2026 Evergreen Lawn Care Services. Insured & Compliant. Static Compiled.',
      style: {
        bgColor: 'bg-emerald-950',
        textColor: 'text-emerald-200',
        paddingY: 'py-8',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  }
];

export const BENTO_SAAS_ELEMENTS: ElementInstance[] = [
  {
    id: 'bento-hdr',
    type: 'header',
    props: {
      logoText: '✦ MatrixFlow',
      links: [
        { label: 'Bento Grid', href: '#bento-metrics' },
        { label: 'Waitlist', href: '#bento-waitlist-box' },
        { label: 'Developers', href: '#sandbox' }
      ],
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-white',
        paddingY: 'py-4',
        paddingX: 'px-6'
      }
    }
  },
  {
    id: 'bento-hero',
    type: 'hero',
    props: {
      title: 'Deploy Bento Interfaces in Record Time',
      subtitle: 'Jumpstart your digital assets presence with responsive, grid-driven bento components. Seamlessly bound to secure NoSQL tables instantly.',
      buttonText: 'Request API Invite',
      buttonLink: '#bento-waitlist-box',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-slate-100',
        paddingY: 'py-20',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  },
  {
    id: 'bento-grid-metrics',
    type: 'features',
    props: {
      title: 'Futuristic Engine Operational Metrics',
      layout: 'bento',
      columns: 3,
      items: [
        {
          id: 'b1',
          title: 'Asynchronous State Bus',
          desc: 'Direct synchronization registers telemetry logs into Firebase Firestore without intermediate REST servers.',
          iconName: 'Cpu'
        },
        {
          id: 'b2',
          title: '99.98% SLA',
          desc: 'High-availability container routing with localized DNS edge nodes.',
          iconName: 'Activity'
        },
        {
          id: 'b3',
          title: 'Zero Latency',
          desc: 'Physically bundled ES components rendering in milliseconds.',
          iconName: 'Zap'
        },
        {
          id: 'b4',
          title: 'Enterprise Cryptography Security',
          desc: 'AES-GCM client token exchange verifies device signatures before unlocking restricted storage directories.',
          iconName: 'Shield'
        }
      ],
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8'
      }
    }
  },
  {
    id: 'bento-countdown-widget',
    type: 'plugin',
    props: {
      pluginId: 'plugin-countdown',
      bannerText: 'EARLY BIRD REGISTRATION: Secure API key block before capacity cap!',
      expiryHours: 6,
      themeColor: '#6366F1'
    }
  },
  {
    id: 'bento-waitlist-box',
    type: 'form',
    props: {
      title: 'Secure Developer Sandbox Credentials',
      submitButtonText: 'Discharge Credentials API',
      targetTable: 'credentials_waitlist',
      fields: [
        {
          id: 'bf1',
          name: 'developerHandle',
          label: 'Developer CLI Handle',
          placeholder: 'e.g. @matrix-miner',
          type: 'text',
          required: true
        },
        {
          id: 'bf2',
          name: 'email',
          label: 'Authorized Email',
          placeholder: 'name@terminal.io',
          type: 'email',
          required: true
        }
      ],
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-slate-300',
        formBgColor: 'bg-[#111116]',
        btnBgColor: 'bg-indigo-600',
        btnTextColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8',
        borderRadius: 'rounded-2xl'
      }
    }
  },
  {
    id: 'bento-footer',
    type: 'footer',
    props: {
      copyright: '© 2026 MatrixFlow Inc. All rights reserved. Bento visual architecture.',
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-slate-500',
        paddingY: 'py-8',
        paddingX: 'px-6'
      }
    }
  }
];

export const BENTO_CREATIVE_ELEMENTS: ElementInstance[] = [
  {
    id: 'bento-creative-hdr',
    type: 'header',
    props: {
      logoText: '✦ NeoStudio',
      links: [
        { label: 'Exhibits', href: '#bento-creative-show' },
        { label: 'Membership Gate', href: '#bento-exclusive-auth' }
      ],
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-white',
        paddingY: 'py-4',
        paddingX: 'px-6'
      }
    }
  },
  {
    id: 'bento-creative-hero',
    type: 'hero',
    props: {
      title: 'Design Aesthetics Squared',
      subtitle: 'A high-impact creative portfolio displaying raw projects inside gorgeous bento-grid cells. Secure access codes required for exclusive lounge visibility.',
      buttonText: 'Enter Member Gateway',
      buttonLink: '#bento-exclusive-auth',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-white',
        paddingY: 'py-20',
        paddingX: 'px-8',
        alignment: 'center'
      }
    }
  },
  {
    id: 'bento-creative-show',
    type: 'features',
    props: {
      title: 'Active Visual Showcases',
      layout: 'bento',
      columns: 3,
      items: [
        {
          id: 'bc1',
          title: 'Quantum Graphic Engine',
          desc: 'WebGL high fidelity canvas structures rendering vectors with standard math equations at 120fps.',
          iconName: 'Image'
        },
        {
          id: 'bc2',
          title: '3D Spatial Mapping',
          desc: 'Stereo textures rendering real depth with zero external model assets.',
          iconName: 'Layers'
        },
        {
          id: 'bc3',
          title: 'Prism Color Filter',
          desc: 'Atmospheric light dispersion simulation engine.',
          iconName: 'Tv'
        },
        {
          id: 'bc4',
          title: 'Minimalist Editorial',
          desc: 'High contrast typography pairings styled with Space Grotesk and absolute grids structure inspired by 1970 Swiss design.',
          iconName: 'Bookmark'
        }
      ],
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-white',
        paddingY: 'py-16',
        paddingX: 'px-8'
      }
    }
  },
  {
    id: 'bento-exclusive-auth',
    type: 'auth_form',
    props: {
      title: 'Secure Client Credentials Access',
      subtitle: 'To inspect full-fidelity confidential Figma layout grids, verify your access token cache below.',
      mode: 'login_signup_box',
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-slate-100',
        formBgColor: 'bg-[#111116]',
        btnBgColor: 'bg-indigo-600',
        btnTextColor: 'text-white',
        paddingY: 'py-16'
      }
    }
  },
  {
    id: 'bento-protected-show',
    type: 'protected',
    props: {
      title: '🗝️ High Fidelity Client NDA Lounge',
      message: 'This section details raw commercial files, pricing ledgers, and interactive 3D assets. Successfully logging in unlocks client telemetry views.',
      authMode: 'show_if_logged_in',
      style: {
        bgColor: 'bg-indigo-950/20',
        textColor: 'text-indigo-200',
        borderColor: 'border-indigo-900/40',
        paddingY: 'py-12',
        paddingX: 'px-8',
        borderRadius: 'rounded-2xl',
        alignment: 'center'
      }
    }
  },
  {
    id: 'bento-creative-footer',
    type: 'footer',
    props: {
      copyright: '© 2026 NeoStudio Swiss Design. Pure standalone retinue.',
      style: {
        bgColor: 'bg-slate-950',
        textColor: 'text-slate-500',
        paddingY: 'py-8',
        paddingX: 'px-6'
      }
    }
  }
];

export const DEFAULT_TEMPLATES: Website[] = [
  {
    id: 'saas-landing',
    name: 'SaaS Waitlist Launch',
    description: 'A dark-mode high-converting Waitlist capture page featuring secure Firestore/Supabase bindings. Ideal for SaaS projects.',
    elements: SAAS_TEMPLE_ELEMENTS,
    integration: {
      provider: 'none'
    },
    createdAt: '2026-06-15T15:00:00Z'
  },
  {
    id: 'bento-modern',
    name: 'Futuristic Bento SaaS Platform',
    description: 'A premium Bento-grid analytics structure with a dark Cosmic theme, waitlist, countdown timers, and integrated telemetry columns.',
    elements: BENTO_SAAS_ELEMENTS,
    integration: {
      provider: 'none'
    },
    createdAt: '2026-06-15T15:30:00Z'
  },
  {
    id: 'bento-creative',
    name: 'Bento Creative Studio Portfolio',
    description: 'A gorgeous, high-contrast Swiss-style design featuring a Bento layout showcase, client portal box, and secure credential locks.',
    elements: BENTO_CREATIVE_ELEMENTS,
    integration: {
      provider: 'none'
    },
    createdAt: '2026-06-15T15:45:00Z'
  },
  {
    id: 'portfolio-clean',
    name: 'Consultant & Designer Portfolio',
    description: 'An elegant, high-contrast digital portfolio showing off previous works, contact submissions and meeting setup.',
    elements: PORTFOLIO_ELEMENTS,
    integration: {
      provider: 'none'
    },
    createdAt: '2026-06-15T16:00:00Z'
  },
  {
    id: 'local-lawncare',
    name: 'Earthy Local Turf Service',
    description: 'A green-themed, highly readable localized page. Ready to submit customer bookings and lawn coordinates to tables.',
    elements: SERVICE_ELEMENTS,
    integration: {
      provider: 'none'
    },
    createdAt: '2026-06-15T17:00:00Z'
  }
];

export const DEFAULT_PLUGINS: PluginDefinition[] = [
  {
    id: 'plugin-testimonials',
    name: 'Testimonial Slider Deluxe',
    description: 'An interactive testimonial card slider with slide transition states, star ratings, and customizable text sizes and speeds.',
    icon: 'MessageSquare',
    author: 'WebCraft Core Team',
    category: 'Marketing',
    developerFields: [
      { name: 'heading', label: 'Main Heading Title', type: 'text', defaultValue: 'What Our Global Community Says' },
      { name: 'bgColor', label: 'Card Background Space', type: 'color', defaultValue: '#1E293B' },
      { name: 'textColor', label: 'Font Accent Color', type: 'color', defaultValue: '#F8FAFC' },
      { name: 'quote1', label: 'Customer Quote #1', type: 'text', defaultValue: 'WebCraft operates fully client-side. There are absolutely no server slowdowns or vendor lock-in!' },
      { name: 'author1', label: 'Customer #1 Sign Off', type: 'text', defaultValue: 'Sarah Jenkins, CTO of InnovateLab' },
      { name: 'quote2', label: 'Customer Quote #2', type: 'text', defaultValue: 'Binding our contact forms directly to secure Firestore collections saved us hundreds of engineering hours.' },
      { name: 'author2', label: 'Customer #2 Sign Off', type: 'text', defaultValue: 'Alex Mercer, Growth Lead' }
    ],
    defaultProps: {
      heading: 'What Our Global Community Says',
      bgColor: '#111827',
      textColor: '#F8FAFC',
      quote1: 'WebCraft operates fully client-side. There are absolutely no server slowdowns or vendor lock-in!',
      author1: 'Sarah Jenkins, CTO of InnovateLab',
      quote2: 'Binding our contact forms directly to secure Firestore collections saved us hundreds of engineering hours.',
      author2: 'Alex Mercer, Growth Lead'
    },
    templateHTML: `
    <!-- Testimonials Carousel Plugin Applied -->
    <div style="background-color: {{bgColor}}; color: {{textColor}};" class="w-full py-16 px-6 font-sans">
      <div class="max-w-4xl mx-auto text-center space-y-8 relative">
        <h3 class="text-3xl font-extrabold tracking-tight">{{heading}}</h3>
        
        <!-- Stars rating -->
        <div class="flex justify-center gap-1.5 text-amber-400 text-lg">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>

        <!-- Slider quotes wrapper -->
        <div class="relative h-44 flex items-center justify-center overflow-hidden">
          <div id="slide-quote-item-1" class="absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-100 translate-x-0 space-y-4">
            <p class="text-lg md:text-xl italic font-medium max-w-2xl leading-relaxed">"{{quote1}}"</p>
            <span class="text-xs font-bold font-mono tracking-wider text-indigo-400 uppercase">— {{author1}}</span>
          </div>
          <div id="slide-quote-item-2" class="absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-0 translate-x-12 space-y-4">
            <p class="text-lg md:text-xl italic font-medium max-w-2xl leading-relaxed">"{{quote2}}"</p>
            <span class="text-xs font-bold font-mono tracking-wider text-indigo-400 uppercase">— {{author2}}</span>
          </div>
        </div>

        <!-- Switch Controls -->
        <div class="flex justify-center gap-3 mt-6">
          <button onclick="switchTestimonial(1)" class="h-3 w-3 rounded-full bg-indigo-500 focus:outline-none transition" id="slide-dot-1"></button>
          <button onclick="switchTestimonial(2)" class="h-3 w-3 rounded-full bg-slate-600 focus:outline-none transition" id="slide-dot-2"></button>
        </div>
      </div>
      
      <script>
        function switchTestimonial(slideIndex) {
          const s1 = document.getElementById('slide-quote-item-1');
          const s2 = document.getElementById('slide-quote-item-2');
          const d1 = document.getElementById('slide-dot-1');
          const d2 = document.getElementById('slide-dot-2');
          
          if (!s1 || !s2 || !d1 || !d2) return;
          
          if (slideIndex === 1) {
            s1.className = "absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-100 translate-x-0 space-y-4";
            s2.className = "absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-0 translate-x-12 space-y-4";
            d1.classList.add('bg-indigo-500'); d1.classList.remove('bg-slate-600');
            d2.classList.remove('bg-indigo-500'); d2.classList.add('bg-slate-600');
          } else {
            s1.className = "absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-0 -translate-x-12 space-y-4";
            s2.className = "absolute inset-x-0 mx-auto flex flex-col justify-center items-center transition duration-500 transform opacity-100 translate-x-0 space-y-4";
            d2.classList.add('bg-indigo-500'); d2.classList.remove('bg-slate-600');
            d1.classList.remove('bg-indigo-500'); d1.classList.add('bg-slate-600');
          }
        }
        
        // Auto rotate testimonials
        let currentActiveSlide = 1;
        setInterval(() => {
          currentActiveSlide = currentActiveSlide === 1 ? 2 : 1;
          switchTestimonial(currentActiveSlide);
        }, 5000);
      </script>
    </div>
    `
  },
  {
    id: 'plugin-faq',
    name: 'FAQ Accordion Block',
    description: 'Renders smooth collapsible accordion item grids with custom indicators and theme styling.',
    icon: 'HelpCircle',
    author: 'WebCraft Core Team',
    category: 'Interactive',
    developerFields: [
      { name: 'title', label: 'Section Title Name', type: 'text', defaultValue: 'Frequently Asked Questions' },
      { name: 'themeColor', label: 'Accordion Active Highlight', type: 'color', defaultValue: '#6366F1' },
      { name: 'q1', label: 'Question #1 Text', type: 'text', defaultValue: 'Can I export the source code of my visuals?' },
      { name: 'a1', label: 'Answer #1 Text', type: 'text', defaultValue: 'Yes! Clicking "Download" exports a pristine, standalone, W3C-valid HTML file packed with Tailwind styles and database connectors. You have 100% full code ownership.' },
      { name: 'q2', label: 'Question #2 Text', type: 'text', defaultValue: 'Are my project databases secure from spam writes?' },
      { name: 'a2', label: 'Answer #2 Text', type: 'text', defaultValue: 'Absolutely. WebCraft embeds strict Security Rules guidelines in the integrations drawer. Copy and apply them directly inside your Firebase rules or Supabase client policy boards.' }
    ],
    defaultProps: {
      title: 'Frequently Asked Questions',
      themeColor: '#6366F1',
      q1: 'Can I export the source code of my visuals?',
      a1: 'Yes! Clicking "Download" exports a pristine, standalone, W3C-valid HTML file packed with Tailwind styles and database connectors. You have 100% full code ownership.',
      q2: 'Are my project databases secure from spam writes?',
      a2: 'Absolutely. WebCraft embeds strict Security Rules guidelines in the integrations drawer. Copy and apply them directly inside your Firebase rules or Supabase client policy boards.'
    },
    templateHTML: `
    <!-- FAQs Accordion Collapsible Plugin Applied -->
    <div class="w-full py-16 px-6 bg-slate-950 font-sans text-slate-300 border-t border-slate-900">
      <div class="max-w-3xl mx-auto space-y-8">
        <h3 class="text-2xl font-bold tracking-tight text-white text-center">{{title}}</h3>
        
        <div class="space-y-4">
          <!-- Accordion 1 -->
          <div class="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
            <button onclick="toggleFaqAccordion(1)" class="w-full py-4 px-5 flex justify-between items-center text-left focus:outline-none group">
              <span class="font-bold text-sm text-white group-hover:text-indigo-400 transition">{{q1}}</span>
              <span id="faq-symbol-1" class="text-sm font-mono text-slate-500 font-bold group-hover:text-white">＋</span>
            </button>
            <div id="faq-answer-pane-1" style="max-height: 0px;" class="transition-all duration-300 overflow-hidden bg-slate-950/20 text-slate-400 text-xs leading-relaxed">
              <div class="p-5 border-t border-slate-850/45">
                {{a1}}
              </div>
            </div>
          </div>

          <!-- Accordion 2 -->
          <div class="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
            <button onclick="toggleFaqAccordion(2)" class="w-full py-4 px-5 flex justify-between items-center text-left focus:outline-none group">
              <span class="font-bold text-sm text-white group-hover:text-indigo-400 transition">{{q2}}</span>
              <span id="faq-symbol-2" class="text-sm font-mono text-slate-500 font-bold group-hover:text-white">＋</span>
            </button>
            <div id="faq-answer-pane-2" style="max-height: 0px;" class="transition-all duration-300 overflow-hidden bg-slate-950/20 text-slate-400 text-xs leading-relaxed">
              <div class="p-5 border-t border-slate-850/45">
                {{a2}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function toggleFaqAccordion(idx) {
          const pane = document.getElementById('faq-answer-pane-' + idx);
          const symbol = document.getElementById('faq-symbol-' + idx);
          if (!pane || !symbol) return;
          
          if (pane.style.maxHeight === '0px' || pane.style.maxHeight === '') {
            pane.style.maxHeight = '300px';
            symbol.innerText = "－";
          } else {
            pane.style.maxHeight = '0px';
            symbol.innerText = "＋";
          }
        }
      </script>
    </div>
    `
  },
  {
    id: 'plugin-pricing',
    name: 'Responsive Pricing Switcher Matrix',
    description: 'Displays professional monthly/yearly interactive pricing cards with discount stickers, highlight badges, and checkout triggers.',
    icon: 'DollarSign',
    author: 'WebCraft Core Team',
    category: 'Conversion',
    developerFields: [
      { name: 'monthlyPrice', label: 'Monthly Option Rate', type: 'text', defaultValue: '$29' },
      { name: 'yearlyPrice', label: 'Yearly Option Rate', type: 'text', defaultValue: '$19' },
      { name: 'currencySymbol', label: 'Currency Symbol', type: 'text', defaultValue: '$' },
      { name: 'saveSticker', label: 'Discount Tag Copy', type: 'text', defaultValue: 'Save 30%' },
      { name: 'popularFeature', label: 'Primary Feature Copy', type: 'text', defaultValue: 'Unlimited secure database submissions' }
    ],
    defaultProps: {
      monthlyPrice: '$29',
      yearlyPrice: '$19',
      currencySymbol: '$',
      saveSticker: 'Save 30%',
      popularFeature: 'Unlimited secure database submissions'
    },
    templateHTML: `
    <!-- Pricing Swapper Plugin Applied -->
    <div class="w-full py-16 px-6 bg-slate-905 border-t border-slate-800 font-sans">
      <div class="max-w-4xl mx-auto space-y-10 text-center">
        <div class="space-y-4">
          <h3 class="text-3xl font-extrabold tracking-tight text-white">Simple, Predictable Plans</h3>
          <p class="text-xs text-slate-400">Zero host lock-in. Compile standalone and keep all profits.</p>
        </div>

        <!-- Billing cycle switcher -->
        <div class="flex items-center justify-center gap-3">
          <span class="text-xs font-semibold text-white">Monthly Billing</span>
          <button onclick="toggleBillingCycle()" class="w-12 h-6 bg-indigo-600 rounded-full p-0.5 flex transition" id="billing-cycle-switch">
            <span class="w-5 h-5 bg-white rounded-full transition transform translate-x-6" id="billing-switch-slider"></span>
          </button>
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-400">Yearly Cycle</span>
            <span class="text-[9px] bg-emerald-990 text-emerald-300 font-mono font-extrabold px-1.5 py-0.5 rounded-full uppercase leading-none">{{saveSticker}}</span>
          </div>
        </div>

        <!-- Plan grids -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left leading-relaxed">
          <!-- Standard plan -->
          <div class="bg-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Starter Core</span>
              <h4 class="text-2xl font-bold text-white">Free Sandbox</h4>
              <p class="text-xs text-slate-400">Best for localized visual prototyping and frontend mock layout tests.</p>
            </div>
            <div class="h-10 text-3xl font-sans text-white font-bold">$0 <span class="text-xs text-slate-500">/ forever</span></div>
            <ul class="text-xs text-slate-400 space-y-2">
              <li>✓ Local logs cache</li>
              <li>✓ Drag-and-drop WYSIWYG</li>
              <li>✓ Standalone compilation</li>
            </ul>
            <button class="w-full py-2 bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold rounded-lg transition">Explore Core</button>
          </div>

          <!-- Professional Plan Card (Most Popular highlighted) -->
          <div class="bg-[#0F0F12] p-8 rounded-2xl border-2 border-indigo-600 flex flex-col justify-between space-y-6 shadow-md relative scale-[1.02]">
            <span class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 text-[8px] font-mono font-bold bg-indigo-600 text-white rounded-full uppercase tracking-wider">Enterprise Mapped</span>
            <div class="space-y-2">
              <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-indigo-400">Premium Operations</span>
              <h4 class="text-2xl font-bold text-white">Scale Suite</h4>
              <p class="text-xs text-slate-350">Equipped with dynamic real-time Firestore or Supabase cloud synchronization.</p>
            </div>
            
            <div class="h-10 text-3xl font-sans text-white font-bold flex items-baseline">
              <span id="plan-switcher-price" class="text-4xl text-indigo-405">{{monthlyPrice}}</span>
              <span class="text-xs text-slate-550 ml-1" id="plan-billing-duration">/ month</span>
            </div>

            <ul class="text-xs text-slate-300 space-y-2">
              <li>✓ {{popularFeature}}</li>
              <li>✓ Supabase Auth + Security Policies</li>
              <li>✓ Clean, standalone zero-trust HTML</li>
            </ul>
            <button class="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-semibold rounded-lg transition shadow">Deploy Production</button>
          </div>
        </div>
      </div>

      <script>
        let isYearlySubActive = true;
        
        function toggleBillingCycle() {
          isYearlySubActive = !isYearlySubActive;
          const switchSlider = document.getElementById('billing-switch-slider');
          const billingContainer = document.getElementById('billing-cycle-switch');
          const priceLabel = document.getElementById('plan-switcher-price');
          const durationLabel = document.getElementById('plan-billing-duration');
          if (!switchSlider || !billingContainer || !priceLabel || !durationLabel) return;
          
          if (isYearlySubActive) {
            switchSlider.style.transform = "translateX(24px)";
            billingContainer.classList.add('bg-indigo-605');
            priceLabel.innerText = "{{yearlyPrice}}";
            durationLabel.innerText = "/ month, billed yearly";
          } else {
            switchSlider.style.transform = "translateX(0px)";
            billingContainer.classList.remove('bg-indigo-605');
            priceLabel.innerText = "{{monthlyPrice}}";
            durationLabel.innerText = "/ month";
          }
        }
      </script>
    </div>
    `
  },
  {
    id: 'plugin-countdown',
    name: 'Flash Countdown Timer Widget',
    description: 'Enables high-priority conversion urgency meters matching accurate countdown tickers configured in minutes or hours.',
    icon: 'Hourglass',
    author: 'WebCraft Core Team',
    category: 'Widgets',
    developerFields: [
      { name: 'bannerText', label: 'Promo Subheader Copy', type: 'text', defaultValue: 'SECURE EARLY ACCESS: High discount spots are vanishing!' },
      { name: 'expiryHours', label: 'Duration Clock Hours', type: 'number', defaultValue: 12 },
      { name: 'themeColor', label: 'Dial Circle Highlights', type: 'color', defaultValue: '#F43F5E' }
    ],
    defaultProps: {
      bannerText: 'SECURE EARLY ACCESS: High discount spots are vanishing!',
      expiryHours: 12,
      themeColor: '#F43F5E'
    },
    templateHTML: `
    <!-- CountdownUrgency Urgency Plugin Applied -->
    <div class="w-full py-12 px-6 bg-slate-950 text-center font-sans border-t border-b border-slate-900">
      <div class="max-w-xl mx-auto space-y-6">
        <p class="text-xs font-bold text-rose-500 tracking-wide uppercase">{{bannerText}}</p>
        
        <!-- Timer matrix columns -->
        <div class="flex items-center justify-center gap-4 text-white">
          <div class="space-y-1">
            <div id="countdown-dial-h" style="border-color: {{themeColor}}" class="w-14 h-14 rounded-xl bg-slate-900 border-2 flex items-center justify-center text-xl font-mono font-bold">12</div>
            <span class="text-[9px] text-slate-500 uppercase tracking-widest block">Hours</span>
          </div>
          <span class="text-xl font-mono text-slate-700 font-bold">:</span>
          <div class="space-y-1">
            <div id="countdown-dial-m" style="border-color: {{themeColor}}" class="w-14 h-14 rounded-xl bg-slate-900 border-2 flex items-center justify-center text-xl font-mono font-bold">00</div>
            <span class="text-[9px] text-slate-500 uppercase tracking-widest block">Minutes</span>
          </div>
          <span class="text-xl font-mono text-slate-700 font-bold">:</span>
          <div class="space-y-1">
            <div id="countdown-dial-s" style="border-color: {{themeColor}}" class="w-14 h-14 rounded-xl bg-slate-900 border-2 flex items-center justify-center text-xl font-mono font-bold">00</div>
            <span class="text-[9px] text-slate-500 uppercase tracking-widest block">Seconds</span>
          </div>
        </div>
      </div>

      <script>
        (function() {
          let targetSecondsRemaining = Number("{{expiryHours}}") * 3600;
          
          function updateUrgencyTicker() {
            if (targetSecondsRemaining <= 0) {
              targetSecondsRemaining = Number("{{expiryHours}}") * 3600;
            }
            
            const hours = Math.floor(targetSecondsRemaining / 3600);
            const minutes = Math.floor((targetSecondsRemaining % 3600) / 60);
            const seconds = targetSecondsRemaining % 60;
            
            const hElem = document.getElementById('countdown-dial-h');
            const mElem = document.getElementById('countdown-dial-m');
            const sElem = document.getElementById('countdown-dial-s');
            
            if (hElem && mElem && sElem) {
              hElem.innerText = String(hours).padStart(2, '0');
              mElem.innerText = String(minutes).padStart(2, '0');
              sElem.innerText = String(seconds).padStart(2, '0');
            }
            targetSecondsRemaining--;
          }
          
          updateUrgencyTicker();
          setInterval(updateUrgencyTicker, 1000);
        })();
      </script>
    </div>
    `
  }
];

export const BENTO_TEMPLATES: Website[] = [
  {
    id: 'bento-tech-hub',
    name: 'Aegis Bento Tech Launchpad',
    description: 'A futuristic neo-dark mode Bento-style landing page design. Complete with interactive grid features, credentials authorization box, and active table registration.',
    elements: [
      {
        id: 'bento-hdr-1',
        type: 'header',
        props: {
          logoText: '✦ AegisSync',
          links: [
            { label: 'Platform Core', href: '#features' },
            { label: 'Secure Portal', href: '#portal' },
            { label: 'Request Onboarding', href: '#form' }
          ],
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-100', paddingY: 'py-4', paddingX: 'px-6' }
        }
      },
      {
        id: 'bento-hero-1',
        type: 'hero',
        props: {
          title: 'Secure No-Code Client Operations',
          subtitle: 'Map secure database forms and conditionally authorized page folders. Fully functional, responsive, compiled in modern Space Grotesk display typography.',
          buttonText: 'Request Operational Access',
          buttonLink: '#form',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
          style: { bgColor: 'bg-slate-950', textColor: 'text-white', paddingY: 'py-16', paddingX: 'px-8', alignment: 'center' }
        }
      },
      {
        id: 'bento-feat-1',
        type: 'features',
        props: {
          title: 'Advanced Robotic Feature Matrix',
          layout: 'bento',
          items: [
            { id: 'bf1-1', title: 'Visual Code Compiler Engine', desc: 'Download standalone index.html hosting files with absolutely zero recurring platform or hosting fees.', iconName: 'Layers' },
            { id: 'bf1-2', title: '🔥 Auth and Database Sync', desc: 'Form fields automatically map and bind to Firestore and Supabase tables securely using zero-trust client rules.', iconName: 'Database' },
            { id: 'bf1-3', title: '🔒 Verified State Gating', desc: 'Secure sections using advanced login middleware. Gate visitor views on active session states.', iconName: 'Lock' },
            { id: 'bf1-4', title: '⚡ Zero Dependency Framework', desc: 'Ultra-light elements render in milliseconds, styled in modern Tailwind CSS and validated against standard W3C specs.', iconName: 'Zap' }
          ],
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-100', paddingY: 'py-12' }
        }
      },
      {
        id: 'bento-form-1',
        type: 'form',
        props: {
          title: 'Request High Priority Deployment Token',
          submitButtonText: 'Initialize Secure Sandbox',
          targetTable: 'subscribers',
          fields: [
            { id: 'bento-bfld1', name: 'email', label: 'Company Work Email', placeholder: 'architect@enterprise.co', type: 'email', required: true },
            { id: 'bento-bfld2', name: 'priority', label: 'Priority Support Required', placeholder: '', type: 'checkbox', required: false }
          ],
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-100', formBgColor: 'bg-[#111116] border border-slate-900', btnBgColor: 'bg-indigo-600', btnTextColor: 'text-white', paddingY: 'py-12' }
        }
      },
      {
        id: 'bento-footer-1',
        type: 'footer',
        props: {
          copyright: '© 2026 AegisSync Corp. Built and compiled with WebCraft.',
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-500', paddingY: 'py-8', alignment: 'center' }
        }
      }
    ],
    integration: { provider: 'none' },
    createdAt: '2026-06-15T18:00:00Z'
  },
  {
    id: 'bento-brand-showcase',
    name: 'Creative Studio Bento Showcase',
    description: 'An elegant, high-contrast, editorial landing page designed for designers and agencies. Rich with bento showcase blocks, responsive galleries, and seamless contact pathways.',
    elements: [
      {
        id: 'bento-hdr-2',
        type: 'header',
        props: {
          logoText: '✎ Studio Nova',
          links: [
            { label: 'Creative Work', href: '#features' },
            { label: 'Schedule consultation', href: '#form' }
          ],
          style: { bgColor: 'bg-neutral-50', textColor: 'text-neutral-900', paddingY: 'py-4', paddingX: 'px-6' }
        }
      },
      {
        id: 'bento-hero-2',
        type: 'hero',
        props: {
          title: 'Fine Digital Artistry paired with Core Code',
          subtitle: 'Designing modern products and experiences. Combining exquisite typography rhythms with fully stable client database integrations.',
          buttonText: 'Acquire Pitch Deck',
          buttonLink: '#form',
          imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
          style: { bgColor: 'bg-white', textColor: 'text-slate-900', paddingY: 'py-16', paddingX: 'px-8', alignment: 'left' }
        }
      },
      {
        id: 'bento-feat-2',
        type: 'features',
        props: {
          title: 'Design Matrix Showcase',
          layout: 'bento',
          items: [
            { id: 'bf2-1', title: 'Enterprise Density Layouts', desc: 'Crafting responsive dashboards with professional scale, secure telemetry lines, and rich metrics cards.', iconName: 'Grid' },
            { id: 'bf2-2', title: '✎ Brand Core & Strategy', desc: 'Defining beautiful typography, spacing margins, and visual trust markers that attract premium users.', iconName: 'Palette' },
            { id: 'bf2-3', title: '🚀 Micro-interactions', desc: 'Integrating buttery-smooth 0.3s hover animations, dynamic slide timers, and click state feeders.', iconName: 'Sparkles' },
            { id: 'bf2-4', title: '🌌 Standalone Web Bundles', desc: 'Every layout converts completely into single-file open-source codebases with absolute user ownership.', iconName: 'FileCode2' }
          ],
          style: { bgColor: 'bg-neutral-50', textColor: 'text-slate-900', paddingY: 'py-12' }
        }
      },
      {
        id: 'bento-form-2',
        type: 'form',
        props: {
          title: 'Schedule Studio Consultation',
          submitButtonText: 'Dispatched Inquiry',
          targetTable: 'inquiries',
          fields: [
            { id: 'bento-fld-name2', name: 'fullname', label: 'Company Representative', placeholder: 'Jack Grealish', type: 'text', required: true },
            { id: 'bento-fld-email2', name: 'email', label: 'Work Email Address', placeholder: 'jack@mancity.co', type: 'email', required: true },
            { id: 'bento-fld-details2', name: 'details', label: 'Inquiry Specifics', placeholder: 'Describe your design & logic requirements...', type: 'textarea', required: true }
          ],
          style: { bgColor: 'bg-neutral-50', textColor: 'text-neutral-900', formBgColor: 'bg-white border border-slate-200', btnBgColor: 'bg-neutral-950', btnTextColor: 'text-white', paddingY: 'py-12' }
        }
      },
      {
        id: 'bento-footer-2',
        type: 'footer',
        props: {
          copyright: '© 2026 Studio Nova Visual Architects. Static & Compiled.',
          style: { bgColor: 'bg-neutral-950', textColor: 'text-neutral-400', paddingY: 'py-8', alignment: 'center' }
        }
      }
    ],
    integration: { provider: 'none' },
    createdAt: '2026-06-15T19:00:00Z'
  },
  {
    id: 'bento-system-control',
    name: 'Advanced System Control Panel',
    description: 'A clinical and high-trust landing page tailored for developers or enterprise products. Incorporates security gateways, active database monitors, and real-time logs layout.',
    elements: [
      {
        id: 'bento-hdr-3',
        type: 'header',
        props: {
          logoText: '⚙️ Aegis Console',
          links: [
            { label: 'Security Auditing', href: '#features' },
            { label: 'Authorize Entry', href: '#login' }
          ],
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-150', paddingY: 'py-4', paddingX: 'px-6' }
        }
      },
      {
        id: 'bento-hero-3',
        type: 'hero',
        props: {
          title: 'Distributed Security Rule Handshakes',
          subtitle: 'Verify and audit network states, client databases, and security rules. Clean, modern, fully responsive dashboard templates built on zero-trust guidelines.',
          buttonText: 'Authenticate Console Portal',
          buttonLink: '#login',
          imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
          style: { bgColor: 'bg-[#0A0A0E]', textColor: 'text-slate-100', paddingY: 'py-16', paddingX: 'px-8', alignment: 'center' }
        }
      },
      {
        id: 'bento-feat-3',
        type: 'features',
        props: {
          title: 'Consolidated Security Architecture',
          layout: 'bento',
          items: [
            { id: 'bf3-1', title: 'Unified Security Policy', desc: 'Auto-generate RLS (Row Level Security) and Firestore Security Rules matching your data collections.', iconName: 'ShieldAlert' },
            { id: 'bf3-3', title: '🔒 Login Handshake', desc: 'Support anonymous and email-based secure authentication protocols built on Firebase & Supabase SDKs.', iconName: 'Lock' },
            { id: 'bf3-2', title: '⚙️ Live Stream Analytics', desc: 'Real-time telemetry and database logs tracking every subscription, sign-up, and message seamlessly.', iconName: 'RefreshCw' },
            { id: 'bf3-4', title: '⚡ Standalone Edge Deploy', desc: 'Zero server footprint. Packaged with client adapters executing safely from Vercel or cloud static buckets.', iconName: 'ArrowRight' }
          ],
          style: { bgColor: 'bg-[#0A0A0E]', textColor: 'text-slate-200', paddingY: 'py-12' }
        }
      },
      {
        id: 'bento-auth-3',
        type: 'auth_form',
        props: {
          title: 'Secure Passport Authentication',
          subtitle: 'Authorize active session state credentials to review telemetry charts and live records databases.',
          mode: 'login_signup_box',
          successRedirectUrl: '#member-dashboard',
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-100', formBgColor: 'bg-[#111116]', btnBgColor: 'bg-indigo-600', btnTextColor: 'text-white', paddingY: 'py-16' }
        }
      },
      {
        id: 'bento-footer-3',
        type: 'footer',
        props: {
          copyright: '© 2026 Distributed Aegis Console Network. Security Audited.',
          style: { bgColor: 'bg-slate-950', textColor: 'text-slate-500', paddingY: 'py-8', alignment: 'center' }
        }
      }
    ],
    integration: { provider: 'none' },
    createdAt: '2026-06-15T20:00:00Z'
  }
];
