import { AnalysisResult } from '../types';

const BACKEND_URL = 'http://localhost:7007/api/vela-backend';

export const analyzeContent = async (
  content: string,
  url: string,
  model: string,
): Promise<AnalysisResult> => {
  const response = await fetch(`${BACKEND_URL}/radar/analyze-content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, url, model }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze content');
  }

  return await response.json();
};
