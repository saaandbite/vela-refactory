export interface StructuredData {
  headers: string[];
  rows: string[][];
}

export interface AnalysisResult {
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

export interface JinaResponse {
  content: string;
  title: string;
  url: string;
  extractedAt: Date;
}
