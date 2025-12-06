import { ScrapedContent } from './types';
import { Config } from '@backstage/config';

export class JinaReader {
    private apiKey: string;
    private baseUrl = 'https://r.jina.ai/';

    constructor(config: Config) {
        // Get your Jina AI API key for free: https://jina.ai/?sui=apikey
        this.apiKey = config.getOptionalString('vela.jina.apiKey') || '';
    }

    async scrape(url: string): Promise<ScrapedContent> {
        try {
            // Validate URL
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                throw new Error('Invalid URL: must start with http:// or https://');
            }

            // Use POST method with JSON body as per Jina documentation
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Retain-Images': 'none',
                'X-With-Links-Summary': 'true',
                'X-With-Images-Summary': 'true',
                'X-Return-Format': 'markdown',
            };

            // Add Authorization if API key exists
            if (this.apiKey) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify({ url }),
                signal: AbortSignal.timeout(30000), // 30 second timeout
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Jina API error response:', errorText);
                throw new Error(`Jina Reader API error (${response.status}): ${errorText.substring(0, 200)}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response from Jina:', text.substring(0, 500));
                throw new Error(`Jina Reader returned non-JSON response. Content-Type: ${contentType}`);
            }

            const data = await response.json();

            // Parse response according to Jina API format
            // Response format: { code, status, data: { title, description, url, content, images, links, usage } }
            if (data.code === 200 && data.data) {
                return {
                    url: data.data.url || url,
                    title: data.data.title || '',
                    description: data.data.description || '',
                    content: data.data.content || '',
                    usage: data.data.usage,
                };
            }

            // Fallback if response format is different
            throw new Error(`Unexpected response format from Jina Reader API`);

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to scrape URL: ${error.message}`);
            }
            throw new Error('Failed to scrape URL: Unknown error');
        }
    }
}
