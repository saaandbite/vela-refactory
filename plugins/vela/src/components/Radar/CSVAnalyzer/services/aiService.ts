import { rateLimiter } from '../utils/rateLimiter';
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
  // Use backend base URL directly for development
  const baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:7007'
    : '';
  
  const url = `${baseUrl}/api/vela-backend${endpoint}`;
  console.log('🌐 Calling backend:', url);
  console.log('📦 Request body:', body);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  console.log('📡 Response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Backend error:', error);
    throw new Error(`Backend API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('📥 Response data:', data);
  return data;
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
  // DISABLED CACHE to avoid bias - always get fresh analysis
  // const cacheKey = `sentiment_${model}_${textColumnIndex}_${sampleSize}_${JSON.stringify(data.slice(0, 5))}`;
  // const cached = cacheManager.get<SentimentAnalysis>(cacheKey);
  // if (cached) return cached;

  console.log('🔍 analyzeSentiment called with:');
  console.log('  - Total rows:', data.length);
  console.log('  - Column index:', textColumnIndex);
  console.log('  - Sample size:', sampleSize);
  console.log('  - Model:', model);
  console.log('  - First 3 rows:', data.slice(0, 3));

  await rateLimiter.checkLimit();

  const sampledData = data.slice(0, sampleSize);
  const texts = sampledData.map(row => row[textColumnIndex]).filter(Boolean);

  console.log(`📝 Extracted ${texts.length} texts from column ${textColumnIndex}`);
  console.log('📝 First 3 texts:', texts.slice(0, 3));

  console.log('🚀 Calling backend API for sentiment analysis...');
  
  const sentimentData = await retryWithBackoff(async () => {
    return await callBackendAPI('/radar/analyze-sentiment', { texts, model });
  });

  console.log('✅ Backend response received');
  console.log('  - Response type:', typeof sentimentData);
  console.log('  - Is array:', Array.isArray(sentimentData));
  console.log('  - Length:', Array.isArray(sentimentData) ? sentimentData.length : 'N/A');
  console.log('  - Full response:', sentimentData);

  // Ensure sentimentData is an array
  const dataArray = Array.isArray(sentimentData) ? sentimentData : [];

  console.log('🔍 Checking sentiment values in response:');
  dataArray.slice(0, 5).forEach((item: any, idx: number) => {
    console.log(`  [${idx}] sentiment: "${item.sentiment}" (type: ${typeof item.sentiment})`);
  });

  // Normalize sentiment values and count
  const normalizedData = dataArray.map((item: any) => ({
    ...item,
    sentiment: String(item.sentiment || 'neutral').toLowerCase().trim()
  }));

  const analysis: SentimentAnalysis = {
    positive: normalizedData.filter((s: any) => s.sentiment === 'positive').length,
    negative: normalizedData.filter((s: any) => s.sentiment === 'negative').length,
    neutral: normalizedData.filter((s: any) => s.sentiment === 'neutral').length,
    data: normalizedData,
  };

  console.log('✅ Transformed sentiment analysis:', {
    positive: analysis.positive,
    negative: analysis.negative,
    neutral: analysis.neutral,
    total: analysis.positive + analysis.negative + analysis.neutral,
    dataLength: analysis.data.length
  });

  // Verify counts
  if (analysis.positive + analysis.negative + analysis.neutral === 0 && dataArray.length > 0) {
    console.error('⚠️ WARNING: No sentiments were counted! Check sentiment field values.');
    console.error('Sample items:', dataArray.slice(0, 3));
  }

  // DISABLED CACHE
  // cacheManager.set(cacheKey, analysis);
  return analysis;
}

export async function analyzeTopics(
  data: any[][],
  textColumnIndex: number,
  sampleSize: number = 50,
  model: string = DEFAULT_MODEL,
): Promise<TopicAnalysis> {
  // DISABLED CACHE to avoid bias - always get fresh analysis
  // const cacheKey = `topics_${model}_${textColumnIndex}_${sampleSize}_${JSON.stringify(data.slice(0, 5))}`;
  // const cached = cacheManager.get<TopicAnalysis>(cacheKey);
  // if (cached) return cached;

  console.log('🔍 analyzeTopics called with:');
  console.log('  - Total rows:', data.length);
  console.log('  - Column index:', textColumnIndex);
  console.log('  - Sample size:', sampleSize);
  console.log('  - Model:', model);
  console.log('  - First 3 rows:', data.slice(0, 3));

  await rateLimiter.checkLimit();

  const sampledData = data.slice(0, sampleSize);
  const texts = sampledData.map(row => row[textColumnIndex]).filter(Boolean);

  console.log(`📝 Extracted ${texts.length} texts from column ${textColumnIndex}`);
  console.log('📝 First 3 texts:', texts.slice(0, 3));

  console.log('🚀 Calling backend API for topic analysis...');
  
  const topics = await retryWithBackoff(async () => {
    return await callBackendAPI('/radar/analyze-topics', { texts, model });
  });

  console.log('✅ Backend response received');
  console.log('  - Response type:', typeof topics);
  console.log('  - Is array:', Array.isArray(topics));
  console.log('  - Length:', Array.isArray(topics) ? topics.length : 'N/A');
  console.log('  - Full response:', topics);

  // Ensure topics is an array
  const topicsArray = Array.isArray(topics) ? topics : [];

  const analysis: TopicAnalysis = { topics: topicsArray };
  
  console.log('Transformed topic analysis:', {
    topicsCount: analysis.topics.length,
    topics: analysis.topics
  });

  // DISABLED CACHE
  // cacheManager.set(cacheKey, analysis);
  return analysis;
}

export { MODELS };
