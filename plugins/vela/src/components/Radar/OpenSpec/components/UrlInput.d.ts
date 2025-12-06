import React from 'react';
interface UrlInputProps {
    onSubmit: (url: string) => Promise<void>;
    loading: boolean;
    error?: string;
}
export declare const UrlInput: React.FC<UrlInputProps>;
export {};
