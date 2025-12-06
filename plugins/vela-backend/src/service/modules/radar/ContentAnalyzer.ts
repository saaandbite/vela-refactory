import { Config } from '@backstage/config';

export interface AnalyzeContentRequest {
  content: string;
  url: string;
  model: string;
}

export interface StructuredData {
  headers: string[];
  rows: string[][];
}

export interface AnalyzeContentResponse {
  summary: string;
  structuredData: StructuredData;
  insights: string[];
  metadata: {
    url: string;
    analyzedAt: string;
    model: string;
    tokensUsed: number;
  };
}

export class ContentAnalyzer {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey =
      config.getOptionalString('vela.openrouter.apiKey') ||
      process.env.OPENROUTER_API_KEY ||
      '';
    this.baseUrl = 'https://openrouter.ai/api/v1';

    console.log('ContentAnalyzer initialized');
  }

  private async callOpenRouter(
    prompt: string,
    model: string,
  ): Promise<{ content: string; tokensUsed: number }> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/vela-platform',
        'X-Title': 'VELA Platform - Web Content Analyzer',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens || 0,
    };
  }

  private getAnalysisPrompt(content: string, url: string): string {
    return `You are a data analyst specializing in data extraction and cleaning. Analyze the following web content and extract structured, clean data that can be represented in a CSV format.

Your task:
1. Identify the main entities, items, or data points in the content
2. Extract them into a structured table format
3. CLEAN THE DATA:
   - Remove HTML tags, special characters, and formatting
   - Normalize text (trim whitespace, fix encoding issues)
   - Standardize date formats (use ISO 8601: YYYY-MM-DD)
   - Convert numbers to proper numeric format (remove commas, currency symbols)
   - Handle missing values consistently (use empty string or "N/A")
   - Remove duplicate entries
   - Ensure consistent capitalization
4. Provide a summary of key findings
5. Generate actionable insights from the data

Content from: ${url}

${content.substring(0, 10000)}

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting, no code blocks, no explanations.

Required JSON format:
{
  "summary": "Brief summary of the content and what data was extracted",
  "headers": ["Column1", "Column2", "Column3"],
  "rows": [
    ["clean_value1", "clean_value2", "clean_value3"],
    ["clean_value1", "clean_value2", "clean_value3"]
  ],
  "insights": [
    "Key insight 1 with specific data points",
    "Key insight 2 with trends or patterns",
    "Key insight 3 with actionable recommendations"
  ]
}

DATA QUALITY REQUIREMENTS:
- All values must be clean, properly formatted, and ready for analysis
- Headers must be descriptive and use snake_case (e.g., "event_name", "start_date")
- Dates must be in YYYY-MM-DD format
- Numbers must be numeric (no commas, currency symbols)
- Text must be trimmed and normalized
- No HTML, markdown, or special formatting characters

Return ONLY the JSON object with clean, analysis-ready data.`;
  }

  async analyzeContent(
    request: AnalyzeContentRequest,
  ): Promise<AnalyzeContentResponse> {
    const prompt = this.getAnalysisPrompt(request.content, request.url);
    const result = await this.callOpenRouter(prompt, request.model);

    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedContent = result.content.trim();
      
      // Remove ```json and ``` markers
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '');
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '');
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.replace(/\s*```$/, '');
      }

      // Parse the JSON response
      const parsed = JSON.parse(cleanedContent);

      return {
        summary: parsed.summary || 'No summary available',
        structuredData: {
          headers: parsed.headers || [],
          rows: parsed.rows || [],
        },
        insights: parsed.insights || [],
        metadata: {
          url: request.url,
          analyzedAt: new Date().toISOString(),
          model: request.model,
          tokensUsed: result.tokensUsed,
        },
      };
    } catch (error) {
      console.error('Failed to parse AI response:', result.content);
      throw new Error(
        `Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
