import React from 'react';
import { CSVData } from '../types';
interface CSVUploaderProps {
    onDataLoaded: (data: CSVData) => void;
    onError: (error: string) => void;
}
export declare const CSVUploader: React.FC<CSVUploaderProps>;
export {};
