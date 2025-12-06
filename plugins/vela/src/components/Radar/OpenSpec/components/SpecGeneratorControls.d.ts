import React from 'react';
interface SpecGeneratorControlsProps {
    hasContent: boolean;
    hasRequirements: boolean;
    hasDesign: boolean;
    onGenerateRequirements: (model: string) => Promise<void>;
    onGenerateDesign: (model: string) => Promise<void>;
    onGenerateTasks: (model: string) => Promise<void>;
    loading: boolean;
    currentStep?: 'requirements' | 'design' | 'tasks';
}
export declare const SpecGeneratorControls: React.FC<SpecGeneratorControlsProps>;
export {};
