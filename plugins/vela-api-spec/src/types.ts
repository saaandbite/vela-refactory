export interface SiteConfig {
  site: {
    name: string;
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
    accent: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    success?: string;
    warning?: string;
    error?: string;
    mode?: 'light' | 'dark';
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: {
      base?: string;
      heading?: string;
    };
  };
  navigation?: NavigationConfig;
  footer?: FooterConfig;
  sections: SectionConfig[];
  pages?: PageConfig[];
}

export interface NavigationConfig {
  logo?: {
    text: string;
    image?: string;
    link?: string;
  };
  links: NavLink[];
  cta?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    icon?: string;
  };
  type?: 'sticky' | 'fixed' | 'static';
  transparent?: boolean;
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  social?: SocialLink[];
}

// Legacy support
export interface NavbarConfig extends NavigationConfig {}

export interface FooterConfig {
  logo?: {
    text: string;
    image?: string;
  };
  tagline?: string;
  copyright: string;
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
  layout?: 'columns' | 'centered' | 'minimal';
  background?: 'default' | 'gradient' | 'image';
  backgroundImage?: string;
}

export interface PageConfig {
  path: string;
  title?: string;
  description?: string;
  sections: SectionConfig[];
}

export interface SectionConfig {
  type: string;
  [key: string]: any;
}

// Legacy support
export interface ComponentConfig {
  type: string;
  content: Record<string, any>;
}

export interface NavLink {
  text: string;
  href: string;
  type?: 'link' | 'dropdown' | 'button';
  icon?: string;
  children?: Array<{
    text: string;
    href: string;
    icon?: string;
  }>;
  // Legacy support
  label?: string;
  path?: string;
}

export interface FooterSection {
  title: string;
  links: Array<{
    text: string;
    href: string;
    icon?: string;
    external?: boolean;
    // Legacy support
    label?: string;
    path?: string;
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
