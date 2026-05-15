import { useState, useEffect, useCallback } from 'react';
import { AGenUI } from '../AGenUI';
import type { AGenUIConfig } from '../types/sdk';

export interface UseAGenUIResult {
  initialized: boolean;
  loading: boolean;
  error: Error | null;
  initialize: (config?: AGenUIConfig) => Promise<void>;
}

export function useAGenUI(): UseAGenUIResult {
  const [initialized, setInitialized] = useState(AGenUI.isInitialized());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const initialize = useCallback(async (config?: AGenUIConfig) => {
    if (AGenUI.isInitialized()) {
      setInitialized(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await AGenUI.initialize(config);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  return { initialized, loading, error, initialize };
}
