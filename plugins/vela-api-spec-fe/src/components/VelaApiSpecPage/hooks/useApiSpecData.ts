import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { velaApiSpecApiRef } from '../../../api';

export function useApiSpecData() {
  const api = useApi(velaApiSpecApiRef);

  const [health, setHealth] = useState<any>(null);
  const [schemas, setSchemas] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = useCallback(async () => {
    try {
      const result = await api.getHealth();
      setHealth(result);
    } catch (err) {
      setError(`Failed to check health: ${err}`);
    }
  }, [api]);

  const loadSchemas = useCallback(async () => {
    try {
      const result = await api.getComponentSchemas();
      setSchemas(result);
    } catch (err) {
      setError(`Failed to load schemas: ${err}`);
    }
  }, [api]);

  useEffect(() => {
    loadHealth();
    loadSchemas();
  }, [loadHealth, loadSchemas]);

  return { api, health, schemas, error, setError };
}
