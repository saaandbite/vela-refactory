import React from 'react';
import { SpecDocuments } from '../types';
interface ExportButtonProps {
    documents: Partial<SpecDocuments>;
    sourceUrl: string;
    disabled?: boolean;
}
export declare const ExportButton: React.FC<ExportButtonProps>;
export {};
