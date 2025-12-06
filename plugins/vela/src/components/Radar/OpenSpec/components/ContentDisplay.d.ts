import React from 'react';
interface ContentDisplayProps {
    content: string;
    loading: boolean;
    onCopy?: () => void;
}
export declare const ContentDisplay: React.FC<ContentDisplayProps>;
export {};
