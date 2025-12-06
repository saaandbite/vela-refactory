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

    const prompt = `Generate a complete website configuration JSON for a Dynamic Site Generator with Server-Driven UI architecture.

Requirements:
- Site Name: "${siteName}"
- Description: "${siteDescription}"
${industry ? `- Industry: "${industry}"` : ''}
${targetAudience ? `- Target Audience: "${targetAudience}"` : ''}
${style ? `- Style: "${style}"` : ''}

Create a complete site config with:
1. Site metadata (name, description, logo, favicon)
2. Theme configuration (colors, fonts, spacing)
3. Navigation bar with 4-5 menu items
4. Footer with links and social media
5. 3-5 pages with appropriate sections

Use these component types: hero, features, grid, stats, team, testimonials, cta, contact, pricing, faq, blog, gallery, process, video, partners

Return ONLY valid JSON without any markdown formatting. Follow this structure:
{
  "site": { "name": "", "description": "", "url": "", "logo": "", "favicon": "" },
  "theme": { "primaryColor": "", "secondaryColor": "", "accentColor": "", "fontFamily": "", "spacing": "" },
  "navbar": { "logo": "", "links": [{ "label": "", "path": "" }], "cta": { "label": "", "path": "" } },
  "footer": { "copyright": "", "links": [], "social": [] },
  "pages": []
}`;

    const result = await this.callMultipleModels(prompt);
    const cleanContent = this.cleanJsonResponse(result);

    try {
      return JSON.parse(cleanContent);
    } catch (e) {
      // Try to extract JSON from response
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
      hero: 'Hero section with title, subtitle, description, CTA buttons, and optional image',
      features:
        'Features grid with icon, title, and description for each feature',
      grid: 'Generic content grid with cards (image, title, description, link)',
      stats: 'Statistics display with number, label, and optional description',
      team: 'Team members with photo, name, role, bio, and social links',
      testimonials: 'Customer testimonials with quote, author, role, avatar',
      cta: 'Call-to-action section with title, description, and buttons',
      contact: 'Contact form with fields and contact information',
      pricing: 'Pricing plans with features, price, and CTA',
      faq: 'Frequently asked questions with question and answer pairs',
      blog: 'Blog post list with title, excerpt, author, date, image',
      gallery: 'Image gallery with title, description, and images',
      process: 'Step-by-step process with icon, title, description',
      video: 'Video embed section with title, description, video URL',
      partners: 'Partner logos with name, logo, and optional link',
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
    const fullPrompt = `You are a website configuration generator. Generate a complete website configuration based on this prompt:

"${prompt}"

Analyze the prompt and create appropriate:
- Site configuration
- Theme
- Pages with sections
- Components

Use these component types: hero, features, grid, stats, team, testimonials, cta, contact, pricing, faq, blog, gallery, process, video, partners

Return ONLY valid JSON without markdown formatting following the site config structure.`;

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
