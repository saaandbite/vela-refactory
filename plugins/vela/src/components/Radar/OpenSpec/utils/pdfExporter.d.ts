import { SpecDocuments } from '../types';
interface PDFExportOptions {
    documents: Partial<SpecDocuments>;
    sourceUrl: string;
    fileName?: string;
}
export declare const exportToPDF: ({ documents, sourceUrl, fileName, }: PDFExportOptions) => Promise<void>;
export {};
