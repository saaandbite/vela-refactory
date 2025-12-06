import React from 'react';
import { CSVData, AnalysisResult } from '../types';
interface ExportButtonProps {
    csvData: CSVData | null;
    analysisResult: AnalysisResult;
    disabled?: boolean;
}
export declare const ExportButton: React.FC<ExportButtonProps>;
export {};
