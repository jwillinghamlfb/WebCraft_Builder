/**
 * Types defining elements, styles, integrations, and websites.
 */

export type ElementType =
  | 'header'
  | 'hero'
  | 'text'
  | 'title'
  | 'image'
  | 'button'
  | 'features'
  | 'form'
  | 'divider'
  | 'protected'
  | 'footer'
  | 'plugin'
  | 'auth_form';

export interface BaseStyles {
  textColor?: string; // e.g. "text-slate-900" or Tailwind color
  bgColor?: string;   // e.g. "bg-white"
  borderColor?: string;
  paddingY?: string;  // e.g. "py-4", "py-12"
  paddingX?: string;
  marginY?: string;
  borderRadius?: string; // "rounded-none" | "rounded-md" | "rounded-lg" | "rounded-full"
  alignment?: 'left' | 'center' | 'right';
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export interface HeaderProps {
  logoText: string;
  links: { label: string; href: string }[];
  style: BaseStyles;
}

export interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  style: BaseStyles;
}

export interface TextProps {
  content: string;
  style: BaseStyles;
}

export interface TitleProps {
  text: string;
  style: BaseStyles;
}

export interface ImageProps {
  url: string;
  alt: string;
  style: BaseStyles;
}

export interface ButtonProps {
  text: string;
  link: string;
  actionType: 'link' | 'auth_login' | 'auth_logout' | 'auth_signup';
  style: BaseStyles & {
    btnBgColor?: string;
    btnTextColor?: string;
  };
}

export interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export interface FeaturesProps {
  title: string;
  items: FeatureItem[];
  columns: 2 | 3 | 4;
  style: BaseStyles;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'checkbox';
  required: boolean;
}

export interface FormProps {
  title: string;
  submitButtonText: string;
  fields: FormField[];
  targetTable: string; // e.g. "leads" or "customers"
  style: BaseStyles & {
    formBgColor?: string;
    btnBgColor?: string;
    btnTextColor?: string;
  };
}

export interface ProtectedProps {
  title: string;
  message: string;
  authMode: 'show_if_logged_in' | 'show_if_guest';
  style: BaseStyles;
}

export interface FooterProps {
  copyright: string;
  style: BaseStyles;
}

export interface ElementInstance {
  id: string;
  type: ElementType;
  props: any; // Dynamic union of specific properties based on type
}

export type DbProvider = 'none' | 'firebase' | 'supabase';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  databaseId?: string; // Optional custom database ID
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface DbIntegration {
  provider: DbProvider;
  firebase?: FirebaseConfig;
  supabase?: SupabaseConfig;
}

export interface PluginDeveloperField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'color' | 'select';
  placeholder?: string;
  options?: string[]; // For select type
  defaultValue: any;
}

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  author: string;
  category: 'Marketing' | 'Interactive' | 'Conversion' | 'Widgets';
  isCustom?: boolean;
  developerFields: PluginDeveloperField[];
  defaultProps: any;
  templateHTML: string; // stand-alone HTML block compiler template
}

export interface Website {
  id: string;
  name: string;
  description: string;
  elements: ElementInstance[];
  integration: DbIntegration;
  createdAt: string;
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

export interface ProjectVersion {
  id: string;
  siteId: string;
  versionName: string;
  elements: ElementInstance[];
  integration: DbIntegration;
  createdAt: string;
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

