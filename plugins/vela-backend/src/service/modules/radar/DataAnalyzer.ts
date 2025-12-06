import { AnalysisResult } from './types';
import { Config } from '@backstage/config';

export class DataAnalyzer {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.getOptionalString('vela.openrouter.apiKey') || '';
    this.baseUrl = config.getOptionalString('vela.openrouter.baseUrl') || 'https://openrouter.ai/api/v1';
  }

  async analyzeText(text: string): Promise<AnalysisResult> {
    const prompt = `
      Analyze the following text and provide a JSON response with:
      1. Summary (brief)
      2. Sentiment (POSITIVE, NEGATIVE, or NEUTRAL) with a confidence score (0-1) and explanation.
      3. Top 3 Topics with relevance score (0-1).

      Text: "${text.substring(0, 5000)}" 
      
      Response Format:
      {
        "summary": "...",
        "sentiment": { "sentiment": "...", "score": 0.9, "explanation": "..." },
        "topics": [ { "topic": "...", "relevance": 0.8 } ]
      }
    `;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vela.platform', // Optional for OpenRouter
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5', // Adjust model as needed
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' } // Ensure JSON output if supported
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI Analysis failed: ${err}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    try {
      return JSON.parse(content) as AnalysisResult;
    } catch (e) {
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
