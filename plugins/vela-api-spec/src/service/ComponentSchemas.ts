export class ComponentSchemas {
  /**
   * Get all component schemas
   */
  getAllSchemas(): Record<string, any> {
    return {
      hero: this.getHeroSchema(),
      'logo-cloud': this.getLogoCloudSchema(),
      features: this.getFeaturesSchema(),
      stats: this.getStatsSchema(),
      testimonials: this.getTestimonialsSchema(),
      pricing: this.getPricingSchema(),
      team: this.getTeamSchema(),
      gallery: this.getGallerySchema(),
      content: this.getContentSchema(),
      grid: this.getGridSchema(),
      faq: this.getFaqSchema(),
      cta: this.getCtaSchema(),
      // Legacy schemas
      contact: this.getContactSchema(),
      blog: this.getBlogSchema(),
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
      required: ['title'],
      properties: {
        alignment: {
          type: 'string',
          enum: ['left', 'center', 'right'],
          default: 'center',
          description: 'Content alignment',
        },
        title: { 
          type: 'string', 
          description: 'Main headline' 
        },
        subtitle: { 
          type: 'string', 
          description: 'Supporting text' 
        },
        cta: {
          type: 'object',
          description: 'Call-to-action buttons',
          properties: {
            primary: {
              type: 'object',
              required: ['text', 'href'],
              properties: {
                text: { type: 'string', description: 'Button text' },
                href: { type: 'string', description: 'Button URL' },
              },
            },
            secondary: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Button text' },
                href: { type: 'string', description: 'Button URL' },
              },
            },
          },
        },
        image: {
          type: 'object',
          description: 'Hero image',
          properties: {
            src: { type: 'string', format: 'uri', description: 'Image URL' },
            alt: { type: 'string', description: 'Alt text for accessibility' },
          },
        },
      },
      example: {
        type: 'hero',
        alignment: 'center',
        title: 'Collaborate Smarter, Work Faster',
        subtitle: 'CloudFlow brings your team together with powerful tools.',
        cta: {
          primary: {
            text: 'Start Free Trial',
            href: '/signup',
          },
          secondary: {
            text: 'Watch Demo',
            href: '#demo',
          },
        },
        image: {
          src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
          alt: 'Team collaboration',
        },
      },
    };
  }

  private getFeaturesSchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        layout: {
          type: 'string',
          enum: ['grid', 'alternate'],
          default: 'grid',
          description: 'Display layout - grid or alternating left/right',
        },
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        items: {
          type: 'array',
          description: 'Feature list',
          items: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
              icon: { 
                type: 'string',
                description: 'Emoji or icon'
              },
              title: { 
                type: 'string',
                description: 'Feature name'
              },
              description: { 
                type: 'string',
                description: 'Feature description'
              },
            },
          },
        },
      },
      example: {
        type: 'features',
        layout: 'grid',
        title: 'Everything you need to succeed',
        subtitle: 'Powerful features designed for modern teams',
        items: [
          {
            icon: '🚀',
            title: 'Lightning Fast',
            description: 'Built for speed with cutting-edge technology.',
          },
          {
            icon: '🔒',
            title: 'Enterprise Security',
            description: 'Bank-level encryption and compliance.',
          },
        ],
      },
    };
  }

  private getGridSchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        items: {
          type: 'array',
          description: 'Grid items',
          items: {
            type: 'object',
            required: ['title', 'description'],
            properties: {
              title: { 
                type: 'string',
                description: 'Item title'
              },
              description: { 
                type: 'string',
                description: 'Item description'
              },
              image: { 
                type: 'string', 
                format: 'uri',
                description: 'Item image URL'
              },
              link: { 
                type: 'string', 
                format: 'uri',
                description: 'Item link URL'
              },
            },
          },
        },
      },
      example: {
        type: 'grid',
        title: 'Shop by Category',
        subtitle: "Find exactly what you're looking for",
        items: [
          {
            title: "Women's Collection",
            description: 'Elegant dresses, tops, and more',
            image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
            link: '/shop/women',
          },
        ],
      },
    };
  }

  private getStatsSchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        items: {
          type: 'array',
          description: 'Statistics list',
          items: {
            type: 'object',
            required: ['value', 'label'],
            properties: {
              value: { 
                type: 'string',
                description: 'The metric value (e.g., "50K+", "99.9%")'
              },
              label: { 
                type: 'string',
                description: 'Metric description'
              },
            },
          },
        },
      },
      example: {
        type: 'stats',
        title: 'Proven results that speak for themselves',
        items: [
          {
            value: '50K+',
            label: 'Active Teams',
          },
          {
            value: '99.9%',
            label: 'Uptime SLA',
          },
          {
            value: '2M+',
            label: 'Tasks Completed',
          },
        ],
      },
    };
  }

  private getTeamSchema() {
    return {
      type: 'object',
      required: ['members'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        members: {
          type: 'array',
          description: 'Team member list',
          items: {
            type: 'object',
            required: ['name', 'role', 'image'],
            properties: {
              name: { 
                type: 'string',
                description: 'Member name'
              },
              role: { 
                type: 'string',
                description: 'Job title/position'
              },
              bio: { 
                type: 'string',
                description: 'Short biography'
              },
              image: { 
                type: 'string', 
                format: 'uri',
                description: 'Profile photo URL'
              },
            },
          },
        },
      },
      example: {
        type: 'team',
        title: 'Meet Our Team',
        subtitle: 'Passionate people behind your dining experience',
        members: [
          {
            name: 'Marco Rossi',
            role: 'Executive Chef',
            bio: 'Trained in Rome, Marco brings 20 years of expertise.',
            image: 'https://i.pravatar.cc/300?img=12',
          },
        ],
      },
    };
  }

  private getTestimonialsSchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        items: {
          type: 'array',
          description: 'Testimonial list',
          items: {
            type: 'object',
            required: ['quote', 'author', 'role'],
            properties: {
              quote: { 
                type: 'string',
                description: 'Testimonial text'
              },
              author: { 
                type: 'string',
                description: "Person's name"
              },
              role: { 
                type: 'string',
                description: "Person's job title"
              },
              company: { 
                type: 'string',
                description: 'Company name (optional)'
              },
              avatar: { 
                type: 'string', 
                format: 'uri',
                description: 'Avatar image URL'
              },
            },
          },
        },
      },
      example: {
        type: 'testimonials',
        title: 'Loved by teams around the world',
        subtitle: 'See what our customers have to say',
        items: [
          {
            quote: 'CloudFlow transformed how our team works.',
            author: 'Sarah Chen',
            role: 'VP of Engineering',
            company: 'TechCorp',
            avatar: 'https://i.pravatar.cc/150?img=1',
          },
        ],
      },
    };
  }

  private getCtaSchema() {
    return {
      type: 'object',
      required: ['title'],
      properties: {
        title: { 
          type: 'string',
          description: 'CTA headline'
        },
        subtitle: { 
          type: 'string',
          description: 'Supporting text'
        },
        cta: {
          type: 'object',
          description: 'Action buttons',
          properties: {
            primary: {
              type: 'object',
              required: ['text', 'href'],
              properties: {
                text: { 
                  type: 'string',
                  description: 'Button text'
                },
                href: { 
                  type: 'string',
                  description: 'Button URL'
                },
              },
            },
            secondary: {
              type: 'object',
              properties: {
                text: { 
                  type: 'string',
                  description: 'Button text'
                },
                href: { 
                  type: 'string',
                  description: 'Button URL'
                },
              },
            },
          },
        },
      },
      example: {
        type: 'cta',
        title: 'Ready to transform your workflow?',
        subtitle: 'Join 50,000+ teams already using CloudFlow',
        cta: {
          primary: {
            text: 'Start Free Trial',
            href: '/signup',
          },
          secondary: {
            text: 'Schedule Demo',
            href: '/demo',
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
      required: ['items'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        items: {
          type: 'array',
          description: 'Pricing plan list',
          items: {
            type: 'object',
            required: ['name', 'price', 'features', 'cta'],
            properties: {
              name: { 
                type: 'string',
                description: 'Plan name'
              },
              price: { 
                type: 'string',
                description: 'Price amount (e.g., "$9", "Custom")'
              },
              period: { 
                type: 'string',
                description: 'Billing period (e.g., "/month", "/year", "")'
              },
              description: { 
                type: 'string',
                description: 'Plan description'
              },
              features: {
                type: 'array',
                description: 'List of features included',
                items: { type: 'string' },
              },
              cta: {
                type: 'object',
                description: 'Call-to-action button',
                required: ['text', 'href'],
                properties: {
                  text: { 
                    type: 'string',
                    description: 'Button text'
                  },
                  href: { 
                    type: 'string',
                    description: 'Button URL'
                  },
                },
              },
              highlighted: { 
                type: 'boolean',
                description: 'Whether to highlight this plan'
              },
            },
          },
        },
      },
      example: {
        type: 'pricing',
        title: 'Simple, transparent pricing',
        subtitle: 'Choose the perfect plan for your team',
        items: [
          {
            name: 'Professional',
            price: '$29',
            period: '/user/month',
            description: 'For growing teams that need more power',
            features: [
              'Unlimited users',
              '100 GB storage',
              'Advanced integrations',
              'Priority support',
            ],
            cta: {
              text: 'Start Free Trial',
              href: '/signup?plan=pro',
            },
            highlighted: true,
          },
        ],
      },
    };
  }

  private getFaqSchema() {
    return {
      type: 'object',
      required: ['items'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        items: {
          type: 'array',
          description: 'FAQ list',
          items: {
            type: 'object',
            required: ['question', 'answer'],
            properties: {
              question: { 
                type: 'string',
                description: 'The question'
              },
              answer: { 
                type: 'string',
                description: 'The answer'
              },
            },
          },
        },
      },
      example: {
        type: 'faq',
        title: 'Frequently Asked Questions',
        items: [
          {
            question: 'Do I need experience to join?',
            answer: 'Not at all! We welcome members of all fitness levels.',
          },
          {
            question: 'What should I bring to my first class?',
            answer: 'Just bring comfortable workout clothes and a water bottle.',
          },
        ],
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
      required: ['images'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        images: {
          type: 'array',
          description: 'Image list',
          items: {
            type: 'object',
            required: ['src', 'alt'],
            properties: {
              src: { 
                type: 'string', 
                format: 'uri',
                description: 'Image URL'
              },
              alt: { 
                type: 'string',
                description: 'Alt text for accessibility'
              },
            },
          },
        },
      },
      example: {
        type: 'gallery',
        title: 'Taste of Italy',
        subtitle: 'A visual journey through our culinary creations',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600',
            alt: 'Pasta dish',
          },
          {
            src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
            alt: 'Pizza margherita',
          },
        ],
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

  private getLogoCloudSchema() {
    return {
      type: 'object',
      required: ['logos'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        logos: {
          type: 'array',
          description: 'Logo list',
          items: {
            type: 'object',
            required: ['name', 'src'],
            properties: {
              name: { 
                type: 'string',
                description: 'Company name'
              },
              src: { 
                type: 'string', 
                format: 'uri',
                description: 'Logo image URL'
              },
            },
          },
        },
      },
      example: {
        type: 'logo-cloud',
        title: 'Trusted by innovative teams worldwide',
        logos: [
          {
            name: 'TechCorp',
            src: 'https://via.placeholder.com/150x50/3b82f6/ffffff?text=TechCorp',
          },
          {
            name: 'DataFlow',
            src: 'https://via.placeholder.com/150x50/3b82f6/ffffff?text=DataFlow',
          },
        ],
      },
    };
  }

  private getContentSchema() {
    return {
      type: 'object',
      required: ['content'],
      properties: {
        title: { 
          type: 'string',
          description: 'Section title'
        },
        subtitle: { 
          type: 'string',
          description: 'Section subtitle'
        },
        content: { 
          type: 'string',
          description: 'Main text content (supports markdown)'
        },
        image: {
          type: 'object',
          description: 'Side image',
          properties: {
            src: { 
              type: 'string', 
              format: 'uri',
              description: 'Image URL'
            },
            alt: { 
              type: 'string',
              description: 'Alt text'
            },
            position: { 
              type: 'string',
              enum: ['left', 'right'],
              description: 'Image position'
            },
          },
        },
      },
      example: {
        type: 'content',
        title: 'Programs Designed for You',
        subtitle: 'Whatever your fitness goal, we have a program',
        content: `At FitFusion, we believe fitness is personal.

**Strength Training** - Build muscle and increase power.
**Cardio & HIIT** - Burn calories and boost endurance.`,
        image: {
          src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
          alt: 'Fitness training session',
          position: 'right',
        },
      },
    };
  }
}
