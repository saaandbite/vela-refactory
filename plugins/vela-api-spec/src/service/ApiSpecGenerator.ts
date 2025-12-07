import { Config } from '@backstage/config';
import {
  SiteConfig,
  PageConfig,
  ComponentConfig,
  ValidationResult,
} from '../types';

export class ApiSpecGenerator {
  constructor(_config: Config) {
    // Config available for future use (e.g., custom templates from config)
  }

  /**
   * Get full site configuration template
   */
  getFullTemplate(): SiteConfig {
    return {
      site: {
        name: 'Your Site Title',
        description: 'Your site description',
        logo: 'https://example.com/logo.png',
        language: 'en',
      },
      theme: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#0f172a',
        background: '#ffffff',
        text: '#1f2937',
        mode: 'light',
      },
      navigation: {
        logo: {
          text: 'Your Site',
        },
        links: [
          { text: 'Home', href: '/' },
          { text: 'About', href: '/about' },
        ],
        cta: {
          text: 'Get Started',
          href: '/start',
          variant: 'primary',
        },
      },
      footer: {
        logo: {
          text: 'Your Site',
        },
        tagline: 'Building something amazing',
        copyright: '© 2024 Your Company',
        sections: [
          {
            title: 'Company',
            links: [{ text: 'About', href: '/about' }],
          },
        ],
      },
      sections: [],
      pages: [
        {
          path: '/',
          title: 'Home',
          sections: [],
        },
      ],
    };
  }

  /**
   * Generate site configuration from input
   */
  async generateSiteConfig(input: Partial<SiteConfig>): Promise<SiteConfig> {
    const template = this.getFullTemplate();

    return {
      site: { ...template.site, ...input.site },
      theme: { ...template.theme, ...input.theme },
      navigation: input.navigation || template.navigation,
      footer: input.footer || template.footer,
      sections: input.sections || template.sections,
      pages: input.pages || template.pages,
    };
  }

  /**
   * Generate a page configuration
   */
  generatePage(page: PageConfig): PageConfig {
    return {
      path: page.path,
      title: page.title,
      description: page.description,
      sections: page.sections,
    };
  }

  /**
   * Generate a component by type
   */
  generateComponent(
    type: string,
    content: Record<string, any>,
  ): ComponentConfig {
    return {
      type,
      content,
    };
  }

  /**
   * Validate site configuration
   */
  validateSiteConfig(siteConfig: any): ValidationResult {
    const errors: Array<{ field: string; message: string }> = [];
    const warnings: Array<{ field: string; message: string }> = [];

    // Validate required fields
    if (!siteConfig.site?.name) {
      errors.push({ field: 'site.name', message: 'Site name is required' });
    }

    if (!siteConfig.site?.description) {
      errors.push({
        field: 'site.description',
        message: 'Site description is required',
      });
    }

    if (!siteConfig.theme?.primary) {
      errors.push({
        field: 'theme.primary',
        message: 'Primary color is required',
      });
    }

    if (!siteConfig.theme?.secondary) {
      errors.push({
        field: 'theme.secondary',
        message: 'Secondary color is required',
      });
    }

    if (!siteConfig.theme?.accent) {
      errors.push({
        field: 'theme.accent',
        message: 'Accent color is required',
      });
    }

    // Validate sections or pages
    if (!siteConfig.sections && !siteConfig.pages) {
      errors.push({
        field: 'sections',
        message: 'Either sections or pages array is required',
      });
    }

    if (siteConfig.pages && Array.isArray(siteConfig.pages)) {
      siteConfig.pages.forEach((page: any, index: number) => {
        if (!page.path) {
          errors.push({
            field: `pages[${index}].path`,
            message: 'Page path is required',
          });
        }
        if (!page.sections || !Array.isArray(page.sections)) {
          errors.push({
            field: `pages[${index}].sections`,
            message: 'Page sections array is required',
          });
        }
      });
    }

    // Warnings
    if (!siteConfig.navigation && !siteConfig.navbar) {
      warnings.push({
        field: 'navigation',
        message: 'Navigation configuration is recommended',
      });
    }

    if (!siteConfig.footer) {
      warnings.push({
        field: 'footer',
        message: 'Footer configuration is recommended',
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get example payloads
   */
  getExample(type: string): any {
    const examples: Record<string, any> = {
      minimal: {
        site: {
          name: 'TechStart Solutions',
          description: 'Enterprise software solutions',
        },
        theme: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          accent: '#0f172a',
        },
        navigation: {
          logo: {
            text: 'TechStart',
          },
          links: [
            { text: 'Home', href: '/' },
            { text: 'Services', href: '/services' },
          ],
          cta: {
            text: 'Get Started',
            href: '/start',
          },
        },
        footer: {
          copyright: '© 2024 TechStart Solutions',
        },
        sections: [
          {
            type: 'hero',
            title: 'Transform Your Business',
            cta: {
              primary: {
                text: 'Get Started',
                href: '/start',
              },
            },
          },
        ],
      },
      portfolio: {
        site: {
          name: 'Pixel Perfect Studio',
          description: 'Award-winning digital agency',
          logo: 'https://example.com/logo.svg',
        },
        theme: {
          primary: '#f59e0b',
          secondary: '#ec4899',
          accent: '#0f172a',
          background: '#0f172a',
          text: '#f1f5f9',
          mode: 'dark',
        },
        navigation: {
          logo: {
            text: 'Pixel Perfect',
          },
          type: 'sticky',
          transparent: true,
          links: [
            { text: 'Work', href: '/work' },
            { text: 'Services', href: '/services' },
          ],
          cta: {
            text: 'Start Project',
            href: '/contact',
          },
        },
        footer: {
          logo: {
            text: 'Pixel Perfect',
          },
          tagline: 'Crafting digital experiences',
          copyright: '© 2024 Pixel Perfect Studio',
          sections: [
            {
              title: 'Services',
              links: [{ text: 'Web Design', href: '/services/web-design' }],
            },
          ],
        },
        sections: [
          {
            type: 'hero',
            title: 'We Create Digital Experiences',
            subtitle: 'Award-winning creative agency',
            alignment: 'center',
            cta: {
              primary: {
                text: 'View Our Work',
                href: '/work',
              },
            },
          },
        ],
      },
    };

    return examples[type] || null;
  }
}
