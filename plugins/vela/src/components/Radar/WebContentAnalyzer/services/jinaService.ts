import { JinaResponse } from '../types';

const BACKEND_URL = 'http://localhost:7007/api/vela-backend';

export const extractContent = async (url: string): Promise<JinaResponse> => {
  const response = await fetch(`${BACKEND_URL}/radar/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to extract content');
  }

  const data = await response.json();

  return {
    content: data.content || '',
    title: data.title || '',
    url: data.url || url,
    extractedAt: new Date(),
  };
};
