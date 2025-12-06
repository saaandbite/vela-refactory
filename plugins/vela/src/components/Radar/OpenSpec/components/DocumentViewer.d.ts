import React from 'react';
import { SpecDocuments } from '../types';
interface DocumentViewerProps {
    documents: Partial<SpecDocuments>;
    onEdit: (docType: string, content: string) => void;
    onRegenerate: (docType: string) => Promise<void>;
}
export declare const DocumentViewer: React.FC<DocumentViewerProps>;
export {};
