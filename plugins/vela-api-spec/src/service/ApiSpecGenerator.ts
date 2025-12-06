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
        title: 'Your Site Title',
        description: 'Your site description',
        logo: 'https://example.com/logo.png',
        language: 'en',
      },
      theme: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
        mode: 'light',
      },
      navbar: {
        type: 'sticky',
        links: [
          { label: 'Home', path: '/' },
          { label: 'About', path: '/about' },
        ],
        cta: {
          text: 'Get Started',
          href: '/start',
          variant: 'primary',
        },
      },
      footer: {
        layout: 'columns',
        tagline: 'Building something amazing',
        sections: [
          {
            title: 'Company',
            links: [{ label: 'About', path: '/about' }],
          },
        ],
        bottom: {
          copyright: '© 2024 Your Company',
        },
      },
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
      navbar: input.navbar || template.navbar,
      footer: input.footer || template.footer,
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
    if (!siteConfig.site?.title) {
      errors.push({ field: 'site.title', message: 'Site title is required' });
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

    if (!siteConfig.theme?.background) {
      errors.push({
        field: 'theme.background',
        message: 'Background color is required',
      });
    }

    if (!siteConfig.theme?.text) {
      errors.push({ field: 'theme.text', message: 'Text color is required' });
    }

    if (
      !siteConfig.theme?.mode ||
      !['light', 'dark'].includes(siteConfig.theme.mode)
    ) {
      errors.push({
        field: 'theme.mode',
        message: 'Theme mode must be "light" or "dark"',
      });
    }

    if (!siteConfig.pages || !Array.isArray(siteConfig.pages)) {
      errors.push({ field: 'pages', message: 'Pages array is required' });
    } else {
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
    if (!siteConfig.navbar) {
      warnings.push({
        field: 'navbar',
        message: 'Navbar configuration is recommended',
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
          title: 'TechStart Solutions',
          description: 'Enterprise software solutions',
        },
        theme: {
          primary: '#2563eb',
          secondary: '#7c3aed',
          background: '#ffffff',
          text: '#1f2937',
          mode: 'light',
        },
        navbar: {
          type: 'sticky',
          links: [
            { label: 'Home', path: '/' },
            { label: 'Services', path: '/services' },
          ],
          cta: {
            text: 'Get Started',
            href: '/start',
          },
        },
        footer: {
          layout: 'minimal',
          bottom: {
            copyright: '© 2024 TechStart Solutions',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'hero',
                content: {
                  title: 'Transform Your Business',
                  cta: {
                    text: 'Get Started',
                    href: '/start',
                  },
                },
              },
            ],
          },
        ],
      },
      portfolio: {
        site: {
          title: 'Pixel Perfect Studio',
          description: 'Award-winning digital agency',
          logo: 'https://example.com/logo.svg',
        },
        theme: {
          primary: '#f59e0b',
          secondary: '#ec4899',
          background: '#0f172a',
          text: '#f1f5f9',
          mode: 'dark',
        },
        navbar: {
          type: 'sticky',
          transparent: true,
          links: [
            { label: 'Work', path: '/work' },
            { label: 'Services', path: '/services' },
          ],
          cta: {
            text: 'Start Project',
            href: '/contact',
          },
        },
        footer: {
          layout: 'columns',
          tagline: 'Crafting digital experiences',
          sections: [
            {
              title: 'Services',
              links: [{ label: 'Web Design', path: '/services/web-design' }],
            },
          ],
          bottom: {
            copyright: '© 2024 Pixel Perfect Studio',
          },
        },
        pages: [
          {
            path: '/',
            sections: [
              {
                type: 'hero',
                content: {
                  title: 'We Create Digital Experiences',
                  subtitle: 'Award-winning creative agency',
                  height: 'full',
                  cta: {
                    text: 'View Our Work',
                    href: '/work',
                  },
                },
              },
            ],
          },
        ],
      },
    };

    return examples[type] || null;
  }
}
