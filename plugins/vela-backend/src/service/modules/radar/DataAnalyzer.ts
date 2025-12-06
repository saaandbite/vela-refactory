import { AnalysisResult } from './types';
import { Config } from '@backstage/config';

export class DataAnalyzer {
  private apiKey: string;
  private jinaApiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.getOptionalString('vela.openrouter.apiKey') || '';
    this.jinaApiKey = config.getOptionalString('vela.jina.apiKey') || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  private async callOpenRouter(prompt: string, model: string = 'amazon/nova-2-lite-v1:free'): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vela.platform',
        'X-Title': 'VELA CSV Analyzer',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  private async enrichTextWithJina(url: string): Promise<string> {
    if (!url.startsWith('http')) return url;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Retain-Images': 'none',
        'X-Return-Format': 'text',
      };

      if (this.jinaApiKey) {
        headers['Authorization'] = `Bearer ${this.jinaApiKey}`;
      }

      const response = await fetch('https://r.jina.ai/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url }),
      });

      if (!response.ok) return url;

      const data = await response.json();
      
      // Extract content from Jina response
      if (data.code === 200 && data.data?.content) {
        return data.data.content;
      }

      return url;
    } catch {
      return url;
    }
  }

  async analyzeText(text: string): Promise<AnalysisResult> {
    const prompt = `
      Analyze the following content and provide a JSON response with:
      1. Summary (brief)
      2. Sentiment (POSITIVE, NEGATIVE, or NEUTRAL) with confidence score (0-1)
      3. Top 3 Topics with relevance score (0-1)

      Content: "${text.substring(0, 5000)}" 
      
      Response Format:
      {
        "summary": "...",
        "sentiment": { "sentiment": "...", "score": 0.9, "explanation": "..." },
        "topics": [ { "topic": "...", "relevance": 0.8 } ]
      }
    `;

    const content = await this.callOpenRouter(prompt);

    try {
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanContent) as AnalysisResult;
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  async analyzeSentiment(texts: string[], model: string = 'amazon/nova-2-lite-v1:free'): Promise<any> {
    // Enrich URLs with Jina if detected
    const enrichedTexts = await Promise.all(
      texts.map(async (text) => {
        const urlMatch = String(text).match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          const enriched = await this.enrichTextWithJina(urlMatch[0]);
          return enriched.substring(0, 500);
        }
        return text;
      })
    );

    const prompt = `Analyze the sentiment of the following texts. Return a JSON array with objects containing "text", "sentiment" (positive/negative/neutral), and "score" (0-1).

Texts:
${enrichedTexts.map((t, i) => `${i + 1}. ${String(t).substring(0, 200)}`).join('\n')}

Return ONLY valid JSON array, no markdown. Example:
[{"text":"example","sentiment":"positive","score":0.9}]`;

    const result = await this.callOpenRouter(prompt, model);
    const cleanContent = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanContent);
    } catch {
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
  }

  async analyzeTopics(texts: string[], model: string = 'amazon/nova-2-lite-v1:free'): Promise<any> {
    const enrichedTexts = await Promise.all(
      texts.map(async (text) => {
        const urlMatch = String(text).match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          const enriched = await this.enrichTextWithJina(urlMatch[0]);
          return enriched.substring(0, 500);
        }
        return text;
      })
    );

    const prompt = `Analyze the following texts and identify main topics/themes. Return a JSON array with objects containing "name" (topic name), "keywords" (array of key terms), and "count" (number of texts related).

Texts:
${enrichedTexts.map((t, i) => `${i + 1}. ${String(t).substring(0, 200)}`).join('\n')}

Return ONLY valid JSON array, no markdown. Example:
[{"name":"Product Quality","keywords":["quality","good"],"count":5}]`;

    const result = await this.callOpenRouter(prompt, model);
    const cleanContent = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      return JSON.parse(cleanContent);
    } catch {
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }
  }
}
