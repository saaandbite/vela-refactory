import {
  GenerationRequest,
  GenerationResponse,
  SpecGeneratorError,
  ERROR_CODES,
} from '../types';

const BACKEND_URL = 'http://localhost:7007/api/vela-backend';
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;

    const delayMs = BASE_DELAY * Math.pow(2, MAX_RETRIES - retries);
    console.log(`Retrying in ${delayMs}ms... (${retries} retries left)`);
    await delay(delayMs);

    return retryWithBackoff(fn, retries - 1);
  }
};

export const generateRequirements = async (
  content: string,
  model: string,
): Promise<GenerationResponse> => {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/radar/generate-spec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          type: 'requirements',
          model,
        } as GenerationRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new SpecGeneratorError(
          error.error || 'Failed to generate requirements',
          ERROR_CODES.GENERATION_FAILED,
          true,
          true,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SpecGeneratorError) throw error;

      throw new SpecGeneratorError(
        'Network error while generating requirements',
        ERROR_CODES.OPENROUTER_API_ERROR,
        true,
        true,
      );
    }
  });
};

export const generateDesign = async (
  content: string,
  model: string,
  requirements: string,
): Promise<GenerationResponse> => {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/radar/generate-spec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          type: 'design',
          model,
          context: { requirements },
        } as GenerationRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new SpecGeneratorError(
          error.error || 'Failed to generate design',
          ERROR_CODES.GENERATION_FAILED,
          true,
          true,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SpecGeneratorError) throw error;

      throw new SpecGeneratorError(
        'Network error while generating design',
        ERROR_CODES.OPENROUTER_API_ERROR,
        true,
        true,
      );
    }
  });
};

export const generateTasks = async (
  content: string,
  model: string,
  requirements: string,
  design: string,
): Promise<GenerationResponse> => {
  return retryWithBackoff(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/radar/generate-spec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          type: 'tasks',
          model,
          context: { requirements, design },
        } as GenerationRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new SpecGeneratorError(
          error.error || 'Failed to generate tasks',
          ERROR_CODES.GENERATION_FAILED,
          true,
          true,
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SpecGeneratorError) throw error;

      throw new SpecGeneratorError(
        'Network error while generating tasks',
        ERROR_CODES.OPENROUTER_API_ERROR,
        true,
        true,
      );
    }
  });
};
