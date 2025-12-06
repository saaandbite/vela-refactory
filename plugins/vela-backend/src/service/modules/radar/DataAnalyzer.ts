import { AnalysisResult } from './types';
import { Config } from '@backstage/config';

export class DataAnalyzer {
  private apiKey: string;
  private jinaApiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    // Try to get from config first, then fallback to environment variables
    this.apiKey = config.getOptionalString('vela.openrouter.apiKey') || 
                  process.env.OPENROUTER_API_KEY || '';
    this.jinaApiKey = config.getOptionalString('vela.jina.apiKey') || 
                      process.env.JINA_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    
    // Debug logging
    console.log('DataAnalyzer initialized');
    console.log('OpenRouter API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT FOUND');
    console.log('Jina API Key:', this.jinaApiKey ? `${this.jinaApiKey.substring(0, 10)}...` : 'NOT FOUND');
  }

  private async callOpenRouter(prompt: string, model: string = 'amazon/nova-2-lite-v1:free'): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    console.log('Calling OpenRouter with model:', model);
    console.log('API Key (first 10 chars):', this.apiKey.substring(0, 10));

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/vela-platform',
        'X-Title': 'VELA Platform',
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
      console.error('OpenRouter API error:', response.status, err);
      throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');
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
    console.log('🔍 Backend analyzeSentiment called');
    console.log('  - Texts count:', texts.length);
    console.log('  - Model:', model);
    console.log('  - First 3 texts:', texts.slice(0, 3));

    // Limit to 20 texts per batch to avoid timeout
    const batchSize = 20;
    if (texts.length > batchSize) {
      console.log(`  ⚠️ Too many texts (${texts.length}), processing in batches of ${batchSize}`);
      const batches = [];
      for (let i = 0; i < texts.length; i += batchSize) {
        batches.push(texts.slice(i, i + batchSize));
      }
      
      const results = [];
      for (let i = 0; i < batches.length; i++) {
        console.log(`  - Processing batch ${i + 1}/${batches.length}`);
        const batchResult = await this.analyzeSentiment(batches[i], model);
        results.push(...batchResult);
      }
      return results;
    }

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

    console.log('  - Enriched texts count:', enrichedTexts.length);

    const prompt = `You are a sentiment analysis expert. Analyze the sentiment of each text below with high accuracy.

IMPORTANT RULES:
1. Analyze each text independently - do NOT let previous texts influence your judgment
2. Consider the ENTIRE context of each text
3. Be precise with sentiment classification
4. Provide confidence scores based on clear sentiment indicators
5. Support multiple languages (English, Indonesian, etc.)
6. Look for emotional indicators: positive words (bagus, puas, recommended, sangat baik, helpful, sempurna), negative words (kecewa, lambat, mengecewakan, kurang, buruk, crash, bug), neutral words (standar, cukup, biasa)

Texts to analyze:
${enrichedTexts.map((t, i) => `${i + 1}. "${String(t).substring(0, 300)}"`).join('\n\n')}

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, no extra text):
[
  {"text": "original text snippet", "sentiment": "positive", "score": 0.95},
  {"text": "original text snippet", "sentiment": "negative", "score": 0.85},
  {"text": "original text snippet", "sentiment": "neutral", "score": 0.70}
]

Sentiment must be exactly: "positive", "negative", or "neutral"
Score must be between 0.0 and 1.0 (higher = more confident)

CRITICAL: Return ONLY the JSON array, nothing else. No explanations, no markdown formatting.`;

    console.log('  - Calling OpenRouter API...');
    const result = await this.callOpenRouter(prompt, model);
    console.log('  - AI response received, length:', result.length);
    console.log('  - First 300 chars:', result.substring(0, 300));
    
    const cleanContent = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    console.log('  - Cleaned content length:', cleanContent.length);
    console.log('  - Cleaned first 200 chars:', cleanContent.substring(0, 200));
    
    try {
      const parsed = JSON.parse(cleanContent);
      console.log('  - JSON parsed successfully');
      console.log('  - Parsed type:', typeof parsed, 'Is array:', Array.isArray(parsed));
      
      if (!Array.isArray(parsed)) {
        console.error('  ❌ Sentiment response is not an array:', parsed);
        return [];
      }
      // Validate and normalize the response
      const normalized = parsed.map((item: any) => ({
        text: String(item.text || '').substring(0, 100),
        sentiment: (item.sentiment || 'neutral').toLowerCase(),
        score: Math.min(1, Math.max(0, Number(item.score) || 0.5))
      }));
      console.log(`Sentiment analysis: ${normalized.length} items processed`);
      return normalized;
    } catch (parseError) {
      console.error('Failed to parse sentiment response:', parseError);
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!Array.isArray(parsed)) return [];
          const normalized = parsed.map((item: any) => ({
            text: String(item.text || '').substring(0, 100),
            sentiment: (item.sentiment || 'neutral').toLowerCase(),
            score: Math.min(1, Math.max(0, Number(item.score) || 0.5))
          }));
          console.log(`Sentiment analysis (fallback): ${normalized.length} items processed`);
          return normalized;
        } catch {
          console.error('Fallback parsing also failed');
          return [];
        }
      }
      console.error('No valid JSON array found in response');
      return [];
    }
  }

  async analyzeTopics(texts: string[], model: string = 'amazon/nova-2-lite-v1:free'): Promise<any> {
    console.log('🔍 Backend analyzeTopics called');
    console.log('  - Texts count:', texts.length);
    console.log('  - Model:', model);
    console.log('  - First 3 texts:', texts.slice(0, 3));

    // For topics, we analyze all texts together but limit to reasonable size
    const maxTexts = 50;
    const textsToAnalyze = texts.length > maxTexts ? texts.slice(0, maxTexts) : texts;
    
    if (texts.length > maxTexts) {
      console.log(`  ⚠️ Too many texts (${texts.length}), analyzing first ${maxTexts}`);
    }

    const enrichedTexts = await Promise.all(
      textsToAnalyze.map(async (text) => {
        const urlMatch = String(text).match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          const enriched = await this.enrichTextWithJina(urlMatch[0]);
          return enriched.substring(0, 500);
        }
        return text;
      })
    );

    console.log('  - Enriched texts count:', enrichedTexts.length);

    const prompt = `You are a topic analysis expert. Analyze ALL the texts below and identify the main topics/themes across the entire dataset.

IMPORTANT RULES:
1. Read and consider ALL texts before identifying topics
2. Group similar themes together
3. Identify 3-7 main topics that cover the dataset
4. Count how many texts relate to each topic (be accurate with counts)
5. Extract key terms that define each topic
6. Support multiple languages (English, Indonesian, etc.)
7. Common topics might include: Product Quality, Customer Service, Pricing, Performance, Features, User Experience, Technical Issues, etc.

Texts to analyze (total: ${enrichedTexts.length} texts):
${enrichedTexts.map((t, i) => `${i + 1}. "${String(t).substring(0, 300)}"`).join('\n\n')}

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, no extra text):
[
  {"name": "Product Quality", "keywords": ["quality", "kualitas", "bagus", "berkualitas"], "count": 15},
  {"name": "Customer Service", "keywords": ["service", "support", "pelayanan", "responsif"], "count": 8},
  {"name": "Performance Issues", "keywords": ["slow", "crash", "lambat", "bug"], "count": 12}
]

Requirements:
- name: Clear, descriptive topic name (2-4 words)
- keywords: 3-5 relevant keywords that define the topic
- count: Number of texts that relate to this topic (total should be approximately ${enrichedTexts.length})

CRITICAL: Return ONLY the JSON array, nothing else. No explanations, no markdown formatting.`;

    const result = await this.callOpenRouter(prompt, model);
    console.log('Raw AI response for topics:', result.substring(0, 200));
    
    const cleanContent = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanContent);
      if (!Array.isArray(parsed)) {
        console.error('Topics response is not an array:', parsed);
        return [];
      }
      // Validate and normalize the response
      const normalized = parsed.map((item: any) => ({
        name: String(item.name || 'Unknown Topic'),
        keywords: Array.isArray(item.keywords) ? item.keywords.slice(0, 5) : [],
        count: Math.max(1, Number(item.count) || 1)
      }));
      console.log(`Topic analysis: ${normalized.length} topics identified`);
      return normalized;
    } catch (parseError) {
      console.error('Failed to parse topics response:', parseError);
      const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (!Array.isArray(parsed)) return [];
          const normalized = parsed.map((item: any) => ({
            name: String(item.name || 'Unknown Topic'),
            keywords: Array.isArray(item.keywords) ? item.keywords.slice(0, 5) : [],
            count: Math.max(1, Number(item.count) || 1)
          }));
          console.log(`Topic analysis (fallback): ${normalized.length} topics identified`);
          return normalized;
        } catch {
          console.error('Fallback parsing also failed');
          return [];
        }
      }
      console.error('No valid JSON array found in response');
      return [];
    }
  }
}
