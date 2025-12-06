import { GenerationResponse } from '../types';
export declare const generateRequirements: (content: string, model: string) => Promise<GenerationResponse>;
export declare const generateDesign: (content: string, model: string, requirements: string) => Promise<GenerationResponse>;
export declare const generateTasks: (content: string, model: string, requirements: string, design: string) => Promise<GenerationResponse>;
