import { CSVData, AnalysisResult } from '../types';
interface PDFExportOptions {
    csvData: CSVData;
    analysisResult: AnalysisResult;
    fileName?: string;
}
export declare const exportToPDF: ({ csvData, analysisResult, fileName, }: PDFExportOptions) => Promise<void>;
export {};
