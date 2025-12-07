import { Config } from '@backstage/config';

export class AIGenerator {
  private apiKey: string;
  private baseUrl: string;
  private models: string[];

  constructor(config: Config) {
    this.apiKey = config.getOptionalString('vela.openrouter.apiKey') || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    // Multiple models for parallel execution with fallback
    this.models = ['kwaipilot/kat-coder-pro:free', 'openai/gpt-oss-120b:free'];
  }

  private async callOpenRouter(
    prompt: string,
    model: string = 'amazon/nova-2-lite-v1:free',
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error(
        'OpenRouter API key not configured. Please set vela.openrouter.apiKey in app-config.yaml',
      );
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vela.platform',
        'X-Title': 'VELA API Spec Generator',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(
        `OpenRouter API error (${model}): ${response.status} - ${err}`,
      );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private async callMultipleModels(prompt: string): Promise<string> {
    // Run all models in parallel
    const modelPromises = this.models.map(async model => {
      try {
        const result = await this.callOpenRouter(prompt, model);
        return { success: true, result, model };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          model,
        };
      }
    });

    // Wait for all models to complete
    const results = await Promise.all(modelPromises);

    // Find first successful result
    const successfulResult = results.find(r => r.success);

    if (successfulResult) {
      return successfulResult.result as string;
    }

    // If all failed, throw error with details
    const errors = results
      .map(r => `${r.model}: ${r.error || 'unknown error'}`)
      .join('; ');
    throw new Error(`All models failed. Errors: ${errors}`);
  }

  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    return content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  async generateSiteConfig(params: {
    siteName: string;
    siteDescription: string;
    industry?: string;
    targetAudience?: string;
    style?: string;
  }): Promise<any> {
    const { siteName, siteDescription, industry, targetAudience, style } =
      params;

    const prompt = `Generate a complete website configuration JSON for a modern web builder with full page structure.

Requirements:
- Site Name: "${siteName}"
- Description: "${siteDescription}"
${industry ? `- Industry: "${industry}"` : ''}
${targetAudience ? `- Target Audience: "${targetAudience}"` : ''}
${style ? `- Style: "${style}"` : ''}

Create a complete site config with:
1. Site metadata (name, description, theme with primary/secondary/accent colors)
2. Navigation with logo, links (with optional children for dropdowns), and CTA
3. Footer with logo, tagline, copyright, sections, and social links
4. Pages array with multiple pages (home, blog, about, docs, status, api)

IMPORTANT: Each page must have:
- slug: URL path
- title: Page title
- description: Meta description
- hero: Hero section for non-home pages
- sections: Array of section objects for home page
- Additional page-specific fields (categories, posts, guides, etc.)

Section types and their props structure:
- hero: { type: 'hero', id: string, props: { layout, title, subtitle, buttons: [{ text, href, variant }], trustIndicators: [], background: { gradient }, image } }
- features: { type: 'features', id: string, props: { title, subtitle, columns, items: [{ id, title, description, icon: { value } }] } }
- stats: { type: 'stats', id: string, props: { background, items: [{ id, value, label }] } }
- testimonials: { type: 'testimonials', id: string, props: { title, subtitle, trustBadge, items: [{ id, content, rating, author: { name, role } }] } }

Return ONLY valid JSON. Structure:
{
  "site": {
    "name": "${siteName}",
    "description": "${siteDescription}",
    "theme": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex"
    },
    "navigation": {
      "logo": { "text": "Logo" },
      "links": [
        { "text": "Features", "href": "#features" },
        { "text": "Resources", "href": "#", "children": [{ "text": "Docs", "href": "/docs" }] }
      ],
      "cta": { "text": "Get Started", "href": "/signup" }
    },
    "footer": {
      "logo": { "text": "Logo" },
      "tagline": "Tagline text",
      "copyright": "© 2025 Company",
      "sections": [
        { "title": "Product", "links": [{ "text": "Features", "href": "#features" }] }
      ],
      "social": [
        { "platform": "twitter", "url": "https://twitter.com/company" }
      ]
    }
  },
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "description": "Description",
      "sections": [
        {
          "type": "hero",
          "id": "hero",
          "props": {
            "layout": "centered",
            "title": "Main Title",
            "subtitle": "Subtitle text",
            "buttons": [
              { "text": "Get Started", "href": "/signup", "variant": "primary" }
            ],
            "trustIndicators": ["500K+ Users"],
            "background": { "gradient": "from-blue-50 to-white" },
            "image": "https://images.unsplash.com/photo-xxx"
          }
        },
        {
          "type": "features",
          "id": "features",
          "props": {
            "title": "Features Title",
            "subtitle": "Features subtitle",
            "columns": 3,
            "items": [
              { "id": "f1", "title": "Feature 1", "description": "Description", "icon": { "value": "🚀" } }
            ]
          }
        }
      ]
    },
    {
      "slug": "/blog",
      "title": "Blog",
      "description": "Blog description",
      "hero": { "title": "Blog Title", "subtitle": "Blog subtitle" },
      "categories": ["All", "Category1"],
      "posts": [
        { "id": 1, "title": "Post Title", "excerpt": "Excerpt", "category": "Category1", "date": "15 Nov 2024", "image": "https://...", "readTime": "5 min" }
      ],
      "newsletter": { "title": "Subscribe", "description": "Get updates", "placeholder": "Email", "buttonText": "Subscribe" }
    }
  ]
}`;

    const result = await this.callMultipleModels(prompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI-generated site config as JSON');
    }
  }

  async generatePage(params: {
    path: string;
    title: string;
    description?: string;
    purpose?: string;
  }): Promise<any> {
    const { path, title, description, purpose } = params;

    const prompt = `Generate a page configuration JSON for a website page.

Page Details:
- Path: "${path}"
- Title: "${title}"
${description ? `- Description: "${description}"` : ''}
${purpose ? `- Purpose: "${purpose}"` : ''}

Create a page config with:
1. Page metadata (path, title, description, meta tags)
2. 3-5 appropriate sections using these components: hero, features, grid, stats, team, testimonials, cta, contact, pricing, faq, blog, gallery, process, video, partners

Return ONLY valid JSON without markdown. Structure:
{
  "path": "",
  "title": "",
  "description": "",
  "meta": { "title": "", "description": "", "keywords": [] },
  "sections": []
}`;

    const result = await this.callMultipleModels(prompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI-generated page config as JSON');
    }
  }

  async generateComponent(params: {
    type: string;
    context?: string;
    content?: string;
  }): Promise<any> {
    const { type, context, content } = params;

    const componentSchemas: Record<string, string> = {
      hero: 'Hero section with alignment, title, subtitle, cta (primary/secondary), and optional image',
      'logo-cloud': 'Company/partner logos with title and logos array (name, src)',
      features:
        'Features with layout (grid/alternate), title, subtitle, items (icon, title, description)',
      stats: 'Statistics display with title and items (value, label)',
      testimonials: 'Customer testimonials with title, subtitle, items (quote, author, role, company, avatar)',
      pricing: 'Pricing plans with title, subtitle, items (name, price, period, description, features, cta, highlighted)',
      team: 'Team members with title, subtitle, members (name, role, bio, image)',
      gallery: 'Image gallery with title, subtitle, images (src, alt)',
      content: 'Text content with title, subtitle, content (markdown), optional image (src, alt, position)',
      grid: 'Generic grid with title, subtitle, items (title, description, image, link)',
      faq: 'FAQ with title and items (question, answer)',
      cta: 'Call-to-action with title, subtitle, cta (primary/secondary)',
    };

    const schema = componentSchemas[type] || 'Generic component';

    const prompt = `Generate a ${type} component configuration JSON.

Component Type: ${type}
Description: ${schema}
${context ? `Context: "${context}"` : ''}
${content ? `Content Requirements: "${content}"` : ''}

Create a realistic ${type} component with appropriate content based on the type.

Return ONLY valid JSON without markdown. Include:
- id (unique identifier)
- type (component type)
- All required fields for this component type
- Realistic content that matches the component purpose

Example structure for ${type}:
{
  "id": "unique-id",
  "type": "${type}",
  ...other fields based on component type
}`;

    const result = await this.callMultipleModels(prompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error(`Failed to parse AI-generated ${type} component as JSON`);
    }
  }

  async enhanceComponent(component: any, instructions: string): Promise<any> {
    const prompt = `Enhance the following component configuration based on these instructions:

Instructions: "${instructions}"

Current Component:
${JSON.stringify(component, null, 2)}

Return the enhanced component as valid JSON without markdown. Keep the same structure but improve content, add details, or modify as per instructions.`;

    const result = await this.callMultipleModels(prompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI-enhanced component as JSON');
    }
  }

  async generateFromPrompt(prompt: string): Promise<any> {
    const fullPrompt = `You are a website configuration generator. Generate a complete website configuration with full page structure based on this prompt:

"${prompt}"

Analyze the prompt and create:
1. Site configuration (name, description, theme)
2. Navigation (logo, links with optional children, cta)
3. Footer (logo, tagline, copyright, sections, social)
4. Pages array with multiple pages including:
   - Home page (/) with sections array
   - Blog page (/blog) with hero, categories, posts, newsletter
   - About page (/about) with hero, stats, mission, vision, values, team
   - Docs page (/docs) with hero and guides
   - Status/tracking page (/status) with hero and statuses
   - API/calculator page (/api) with hero and comingSoon

Section structure for home page:
- hero: { type: 'hero', id: 'hero', props: { layout: 'centered', title, subtitle, buttons: [{ text, href, variant }], trustIndicators: [], background: { gradient }, image } }
- features: { type: 'features', id: 'features', props: { title, subtitle, columns: 3, items: [{ id, title, description, icon: { value } }] } }
- stats: { type: 'stats', id: 'stats', props: { background: 'bg-color', items: [{ id, value, label }] } }
- testimonials: { type: 'testimonials', id: 'testimonials', props: { title, subtitle, trustBadge, items: [{ id, content, rating, author: { name, role } }] } }

Return ONLY valid JSON. Full structure:
{
  "site": {
    "name": "Site Name",
    "description": "Description",
    "theme": { "primary": "#hex", "secondary": "#hex", "accent": "#hex" },
    "navigation": {
      "logo": { "text": "Logo" },
      "links": [
        { "text": "Features", "href": "#features" },
        { "text": "Resources", "href": "#", "children": [{ "text": "Docs", "href": "/docs" }] }
      ],
      "cta": { "text": "Get Started", "href": "/signup" }
    },
    "footer": {
      "logo": { "text": "Logo" },
      "tagline": "Tagline",
      "copyright": "© 2025 Company",
      "sections": [{ "title": "Product", "links": [{ "text": "Features", "href": "#features" }] }],
      "social": [{ "platform": "twitter", "url": "https://twitter.com/company" }]
    }
  },
  "pages": [
    {
      "slug": "/",
      "title": "Home",
      "description": "Home page description",
      "sections": [
        { "type": "hero", "id": "hero", "props": { "layout": "centered", "title": "Title", "subtitle": "Subtitle", "buttons": [{ "text": "CTA", "href": "/signup", "variant": "primary" }], "trustIndicators": ["500K+ Users"], "background": { "gradient": "from-blue-50 to-white" }, "image": "https://images.unsplash.com/photo-xxx" } },
        { "type": "features", "id": "features", "props": { "title": "Features", "subtitle": "Subtitle", "columns": 3, "items": [{ "id": "f1", "title": "Feature", "description": "Desc", "icon": { "value": "🚀" } }] } },
        { "type": "stats", "id": "stats", "props": { "background": "bg-blue-900", "items": [{ "id": "s1", "value": "500K+", "label": "Users" }] } },
        { "type": "testimonials", "id": "testimonials", "props": { "title": "Testimonials", "subtitle": "What people say", "trustBadge": "Trusted by thousands", "items": [{ "id": "t1", "content": "Great product!", "rating": 5, "author": { "name": "John Doe", "role": "CEO" } }] } }
      ]
    },
    {
      "slug": "/blog",
      "title": "Blog",
      "description": "Blog description",
      "hero": { "title": "Blog", "subtitle": "Latest articles" },
      "categories": ["All", "News", "Guides"],
      "posts": [{ "id": 1, "title": "Post Title", "excerpt": "Excerpt", "category": "News", "date": "15 Nov 2024", "image": "https://images.unsplash.com/photo-xxx", "readTime": "5 min" }],
      "newsletter": { "title": "Subscribe", "description": "Get updates", "placeholder": "Email", "buttonText": "Subscribe" }
    },
    {
      "slug": "/about",
      "title": "About",
      "description": "About us",
      "hero": { "title": "About Us", "subtitle": "Our story" },
      "stats": [{ "value": "5+", "label": "Years" }],
      "mission": { "title": "Mission", "description": "Our mission", "icon": "vision", "gradient": "from-blue-600 to-blue-700" },
      "vision": { "title": "Vision", "description": "Our vision", "icon": "mission", "gradient": "from-green-600 to-green-700" },
      "values": { "title": "Values", "subtitle": "What we believe", "items": [{ "title": "Value", "description": "Description", "icon": "check" }] },
      "team": { "title": "Team", "subtitle": "Meet the team", "members": [{ "name": "Name", "role": "Role", "image": "https://images.unsplash.com/photo-xxx" }] }
    }
  ]
}`;

    const result = await this.callMultipleModels(fullPrompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error(
        'Failed to parse AI-generated config from prompt as JSON',
      );
    }
  }
}
