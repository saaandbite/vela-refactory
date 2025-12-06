import React from 'react';
interface AnalysisControlsProps {
    headers: string[];
    onAnalyzeSentiment: (columnIndex: number, sampleSize: number, model: string) => Promise<void>;
    onAnalyzeTopics: (columnIndex: number, sampleSize: number, model: string) => Promise<void>;
}
export declare const AnalysisControls: React.FC<AnalysisControlsProps>;
export {};
