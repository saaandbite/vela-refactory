import { useState } from 'react';
import { VelaApiSpecApi } from '../../../api';

export function useApiOperations(
  api: VelaApiSpecApi,
  setError: (error: string | null) => void,
) {
  const [loading, setLoading] = useState(false);
  const [selectedComponentType, setSelectedComponentType] = useState('hero');
  const [componentSchema, setComponentSchema] = useState<any>(null);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [example, setExample] = useState<any>(null);

  const loadComponentSchema = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getComponentSchema(selectedComponentType);
      setComponentSchema(result);
    } catch (err) {
      setError(`Failed to load component schema: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const generateSiteConfig = async (
    siteName: string,
    siteDescription: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateSiteConfig({
        siteName,
        siteDescription,
        includeDefaults: true,
      });
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate site config: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const generatePage = async (pagePath: string, pageTitle: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generatePage({
        path: pagePath,
        title: pageTitle,
      });
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate page: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const generateComponent = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.generateComponent(selectedComponentType, {});
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate component: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const validateConfig = async () => {
    if (!generatedResult) {
      setError('No configuration to validate. Generate something first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await api.validateSiteConfig(generatedResult);
      setValidationResult(result);
    } catch (err) {
      setError(`Failed to validate: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = async (exampleType: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getExample(exampleType);
      setExample(result);
    } catch (err) {
      setError(`Failed to load example: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // AI Operations
  const aiGenerateSiteConfig = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.aiGenerateSiteConfig(params);
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate with AI: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const aiGeneratePage = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.aiGeneratePage(params);
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate page with AI: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const aiGenerateComponent = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.aiGenerateComponent(params.type, params);
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate component with AI: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const aiGenerateFromPrompt = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.aiGenerateFromPrompt(prompt);
      setGeneratedResult(result);
    } catch (err) {
      setError(`Failed to generate from prompt: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    selectedComponentType,
    setSelectedComponentType,
    componentSchema,
    generatedResult,
    validationResult,
    setValidationResult,
    example,
    loadComponentSchema,
    generateSiteConfig,
    generatePage,
    generateComponent,
    validateConfig,
    loadExample,
    aiGenerateSiteConfig,
    aiGeneratePage,
    aiGenerateComponent,
    aiGenerateFromPrompt,
  };
}
