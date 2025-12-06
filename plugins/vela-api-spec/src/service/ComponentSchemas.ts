export class ComponentSchemas {
  /**
   * Get all component schemas
   */
  getAllSchemas(): Record<string, any> {
    return {
      hero: this.getHeroSchema(),
      features: this.getFeaturesSchema(),
      grid: this.getGridSchema(),
      stats: this.getStatsSchema(),
      team: this.getTeamSchema(),
      testimonials: this.getTestimonialsSchema(),
      cta: this.getCtaSchema(),
      contact: this.getContactSchema(),
      pricing: this.getPricingSchema(),
      faq: this.getFaqSchema(),
      blog: this.getBlogSchema(),
      gallery: this.getGallerySchema(),
      process: this.getProcessSchema(),
      video: this.getVideoSchema(),
      partners: this.getPartnersSchema(),
    };
  }

  /**
   * Get schema for a specific component type
   */
  getSchema(type: string): any {
    const schemas = this.getAllSchemas();
    return schemas[type] || null;
  }

  private getHeroSchema() {
    return {
      type: 'object',
      required: ['title', 'cta'],
      properties: {
        title: { type: 'string', description: 'Main hero title' },
        subtitle: { type: 'string', description: 'Hero subtitle (optional)' },
        description: {
          type: 'string',
          description: 'Hero description (optional)',
        },
        height: {
          type: 'string',
          enum: ['full', 'medium', 'small'],
          default: 'full',
        },
        alignment: {
          type: 'string',
          enum: ['left', 'center', 'right'],
          default: 'center',
        },
        backgroundImage: { type: 'string', format: 'uri' },
        backgroundVideo: { type: 'string', format: 'uri' },
        overlay: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean' },
            color: { type: 'string' },
            opacity: { type: 'number', minimum: 0, maximum: 1 },
          },
        },
        cta: {
          type: 'object',
          required: ['text', 'href'],
          properties: {
            text: { type: 'string' },
            href: { type: 'string' },
            variant: {
              type: 'string',
              enum: ['primary', 'secondary', 'outline'],
            },
            icon: { type: 'string' },
          },
        },
        secondaryCta: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            href: { type: 'string' },
            variant: { type: 'string', enum: ['link', 'outline'] },
          },
        },
      },
      example: {
        type: 'hero',
        content: {
          title: 'Welcome to Our Platform',
          subtitle: 'Build amazing things',
          cta: {
            text: 'Get Started',
            href: '/start',
            variant: 'primary',
          },
        },
      },
    };
  }

  private getFeaturesSchema() {
    return {
      type: 'object',
      required: ['title', 'features'],
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'list', 'carousel'],
          default: 'grid',
        },
        columns: { type: 'number', minimum: 2, maximum: 4, default: 3 },
        features: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              icon: { type: 'string' },
              iconColor: { type: 'string' },
              image: { type: 'string', format: 'uri' },
            },
          },
        },
      },
    };
  }

  private getGridSchema() {
    return {
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        columns: { type: 'number', minimum: 2, maximum: 4, default: 3 },
        style: {
          type: 'string',
          enum: ['card', 'minimal', 'overlay'],
          default: 'card',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title'],
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              image: { type: 'string', format: 'uri' },
              link: { type: 'string', format: 'uri' },
              category: { type: 'string' },
              tags: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    };
  }

  private getStatsSchema() {
    return {
      type: 'object',
      required: ['stats'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'row', 'compact'],
          default: 'grid',
        },
        stats: {
          type: 'array',
          items: {
            type: 'object',
            required: ['label', 'value'],
            properties: {
              label: { type: 'string' },
              value: { type: 'string' },
              prefix: { type: 'string' },
              suffix: { type: 'string' },
              icon: { type: 'string' },
            },
          },
        },
      },
    };
  }

  private getTeamSchema() {
    return {
      type: 'object',
      required: ['title', 'members'],
      properties: {
        title: { type: 'string' },
        layout: { type: 'string', enum: ['grid', 'carousel'], default: 'grid' },
        members: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'role', 'avatar'],
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              avatar: { type: 'string', format: 'uri' },
              bio: { type: 'string' },
              social: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    platform: { type: 'string' },
                    url: { type: 'string', format: 'uri' },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  private getTestimonialsSchema() {
    return {
      type: 'object',
      required: ['title', 'testimonials'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'carousel', 'masonry'],
          default: 'grid',
        },
        testimonials: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'content'],
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              company: { type: 'string' },
              avatar: { type: 'string', format: 'uri' },
              content: { type: 'string' },
              rating: { type: 'number', minimum: 1, maximum: 5 },
            },
          },
        },
      },
    };
  }

  private getCtaSchema() {
    return {
      type: 'object',
      required: ['title', 'primaryCta'],
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        description: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['centered', 'split', 'banner'],
          default: 'centered',
        },
        primaryCta: {
          type: 'object',
          required: ['text', 'href'],
          properties: {
            text: { type: 'string' },
            href: { type: 'string' },
            variant: { type: 'string' },
          },
        },
      },
    };
  }

  private getContactSchema() {
    return {
      type: 'object',
      required: ['title', 'form'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['form-only', 'split', 'side-by-side'],
        },
        form: {
          type: 'object',
          required: ['action', 'fields'],
          properties: {
            action: { type: 'string', format: 'uri' },
            method: { type: 'string', enum: ['POST', 'GET'], default: 'POST' },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                required: ['name', 'label', 'type'],
                properties: {
                  name: { type: 'string' },
                  label: { type: 'string' },
                  type: {
                    type: 'string',
                    enum: ['text', 'email', 'tel', 'textarea', 'select'],
                  },
                  required: { type: 'boolean' },
                },
              },
            },
          },
        },
      },
    };
  }

  private getPricingSchema() {
    return {
      type: 'object',
      required: ['title', 'plans'],
      properties: {
        title: { type: 'string' },
        plans: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'price', 'features', 'cta'],
            properties: {
              name: { type: 'string' },
              featured: { type: 'boolean' },
              price: {
                type: 'object',
                properties: {
                  monthly: { type: 'string' },
                  yearly: { type: 'string' },
                  currency: { type: 'string' },
                },
              },
              features: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    included: { type: 'boolean' },
                  },
                },
              },
              cta: {
                type: 'object',
                properties: {
                  text: { type: 'string' },
                  href: { type: 'string' },
                },
              },
            },
          },
        },
      },
    };
  }

  private getFaqSchema() {
    return {
      type: 'object',
      required: ['title', 'categories'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['accordion', 'grid'],
          default: 'accordion',
        },
        categories: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['question', 'answer'],
                  properties: {
                    question: { type: 'string' },
                    answer: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  private getBlogSchema() {
    return {
      type: 'object',
      required: ['title', 'posts'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'list', 'masonry'],
          default: 'grid',
        },
        posts: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title', 'date', 'link'],
            properties: {
              title: { type: 'string' },
              excerpt: { type: 'string' },
              image: { type: 'string', format: 'uri' },
              author: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  avatar: { type: 'string', format: 'uri' },
                },
              },
              date: { type: 'string' },
              link: { type: 'string', format: 'uri' },
            },
          },
        },
      },
    };
  }

  private getGallerySchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'masonry', 'carousel'],
          default: 'grid',
        },
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['image'],
            properties: {
              image: { type: 'string', format: 'uri' },
              title: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
      },
    };
  }

  private getProcessSchema() {
    return {
      type: 'object',
      required: ['title', 'steps'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['vertical', 'horizontal', 'grid'],
          default: 'vertical',
        },
        steps: {
          type: 'array',
          items: {
            type: 'object',
            required: ['title'],
            properties: {
              number: { type: 'number' },
              title: { type: 'string' },
              description: { type: 'string' },
              icon: { type: 'string' },
            },
          },
        },
      },
    };
  }

  private getVideoSchema() {
    return {
      type: 'object',
      required: ['video'],
      properties: {
        title: { type: 'string' },
        video: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string', format: 'uri' },
            provider: { type: 'string', enum: ['youtube', 'vimeo', 'custom'] },
            thumbnail: { type: 'string', format: 'uri' },
          },
        },
      },
    };
  }

  private getPartnersSchema() {
    return {
      type: 'object',
      required: ['partners'],
      properties: {
        title: { type: 'string' },
        layout: {
          type: 'string',
          enum: ['grid', 'carousel', 'marquee'],
          default: 'grid',
        },
        partners: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'logo'],
            properties: {
              name: { type: 'string' },
              logo: { type: 'string', format: 'uri' },
              link: { type: 'string', format: 'uri' },
            },
          },
        },
      },
    };
  }
}
