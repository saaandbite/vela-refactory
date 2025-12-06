import { JinaResponse } from '../types';

const BACKEND_URL = 'http://localhost:7007/api/vela-backend';

export const extractContent = async (url: string): Promise<JinaResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/radar/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!response.ok) {
      let errorMessage = 'Failed to extract content';
      try {
        if (isJson) {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } else {
          const text = await response.text();
          errorMessage = text.substring(0, 200) || errorMessage;
        }
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (!isJson) {
      throw new Error('Backend returned invalid response format');
    }

    const data = await response.json();

    if (!data.content) {
      throw new Error('No content extracted from URL');
    }

    return {
      content: data.content || '',
      title: data.title || '',
      url: data.url || url,
      extractedAt: new Date(),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to extract content from URL');
  }
};
