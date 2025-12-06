import { ScrapedContent } from './types';
import { Config } from '@backstage/config';

export class JinaReader {
    private apiKey: string;
    private baseUrl = 'https://r.jina.ai/';

    constructor(config: Config) {
        this.apiKey = config.getOptionalString('vela.jina.apiKey') || '';
    }

    async scrape(url: string): Promise<ScrapedContent> {
        const targetUrl = `${this.baseUrl}${url}`;

        // Jina Reader usually just needs a GET request to https://r.jina.ai/<url>
        // Headers can be used for JSON output
        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'X-Retain-Images': 'none',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Jina Reader failed: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            url: data.url || url,
            title: data.title || '',
            description: data.description || '',
            content: data.content || '',
            usage: data.usage
        };
    }
}
