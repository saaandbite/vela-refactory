export interface SiteConfig {
  site: {
    title: string;
    description: string;
    favicon?: string;
    logo?: string;
    keywords?: string;
    author?: string;
    language?: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    surface?: string;
    text: string;
    textSecondary?: string;
    border?: string;
    success?: string;
    warning?: string;
    error?: string;
    mode: 'light' | 'dark';
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: {
      base?: string;
      heading?: string;
    };
  };
  navbar?: NavbarConfig;
  footer?: FooterConfig;
  pages: PageConfig[];
}

export interface NavbarConfig {
  type?: 'sticky' | 'fixed' | 'static';
  transparent?: boolean;
  showLogo?: boolean;
  logo?: {
    image?: string;
    text?: string;
    link?: string;
  };
  links: NavLink[];
  cta?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  };
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  social?: SocialLink[];
}

export interface FooterConfig {
  layout?: 'columns' | 'centered' | 'minimal';
  showLogo?: boolean;
  logo?: {
    image?: string;
    text?: string;
  };
  tagline?: string;
  sections?: FooterSection[];
  social?: SocialLink[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  newsletter?: {
    enabled: boolean;
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
  };
  bottom: {
    copyright: string;
    links?: Array<{ label: string; path: string }>;
  };
  background?: 'default' | 'gradient' | 'image';
  backgroundImage?: string;
}

export interface PageConfig {
  path: string;
  title?: string;
  description?: string;
  sections: ComponentConfig[];
}

export interface ComponentConfig {
  type: string;
  content: Record<string, any>;
}

export interface NavLink {
  label: string;
  path: string;
  type?: 'link' | 'dropdown' | 'button';
  icon?: string;
  children?: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
}

export interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    path: string;
    icon?: string;
    external?: boolean;
  }>;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
  }>;
}
