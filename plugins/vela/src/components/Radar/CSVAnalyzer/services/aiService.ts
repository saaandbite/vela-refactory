import { rateLimiter } from '../utils/rateLimiter';
import { cacheManager } from '../utils/cache';
import { SentimentAnalysis, TopicAnalysis } from '../types';

// Available models
const MODELS = {
  NOVA: 'amazon/nova-2-lite-v1:free',
  KAT_CODER: 'kwaipilot/kat-coder-pro:free',
  NEMOTRON: 'nvidia/nemotron-nano-12b-v2-vl:free',
};

// Default model for analysis
const DEFAULT_MODEL = MODELS.NOVA;

async function callBackendAPI(endpoint: string, body: any): Promise<any> {
  const response = await fetch(`/api/vela-backend${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend API error: ${response.status} - ${error}`);
  }

  return response.json();
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries reached');
}

export async function analyzeSentiment(
  data: any[][],
  textColumnIndex: number,
  sampleSize: number = 50,
  model: string = DEFAULT_MODEL,
): Promise<SentimentAnalysis> {
  const cacheKey = `sentiment_${model}_${textColumnIndex}_${sampleSize}_${JSON.stringify(data.slice(0, 5))}`;
  const cached = cacheManager.get<SentimentAnalysis>(cacheKey);
  if (cached) return cached;

  await rateLimiter.checkLimit();

  const sampledData = data.slice(0, sampleSize);
  const texts = sampledData.map(row => row[textColumnIndex]).filter(Boolean);

  const sentimentData = await retryWithBackoff(async () => {
    return await callBackendAPI('/radar/analyze-sentiment', { texts, model });
  });

  const analysis: SentimentAnalysis = {
    positive: sentimentData.filter((s: any) => s.sentiment === 'positive').length,
    negative: sentimentData.filter((s: any) => s.sentiment === 'negative').length,
    neutral: sentimentData.filter((s: any) => s.sentiment === 'neutral').length,
    data: sentimentData,
  };

  cacheManager.set(cacheKey, analysis);
  return analysis;
}

export async function analyzeTopics(
  data: any[][],
  textColumnIndex: number,
  sampleSize: number = 50,
  model: string = DEFAULT_MODEL,
): Promise<TopicAnalysis> {
  const cacheKey = `topics_${model}_${textColumnIndex}_${sampleSize}_${JSON.stringify(data.slice(0, 5))}`;
  const cached = cacheManager.get<TopicAnalysis>(cacheKey);
  if (cached) return cached;

  await rateLimiter.checkLimit();

  const sampledData = data.slice(0, sampleSize);
  const texts = sampledData.map(row => row[textColumnIndex]).filter(Boolean);

  const topics = await retryWithBackoff(async () => {
    return await callBackendAPI('/radar/analyze-topics', { texts, model });
  });

  const analysis: TopicAnalysis = { topics };
  cacheManager.set(cacheKey, analysis);
  return analysis;
}

export { MODELS };
