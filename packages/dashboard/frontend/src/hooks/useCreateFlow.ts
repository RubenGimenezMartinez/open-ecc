import { useCallback } from 'react';
import { useFlowStore } from '@/store/useFlowStore';
import { api } from '@/services/api';

export function useCreateFlow() {
  const addFlow = useFlowStore((state) => state.addFlow);
  const setLoading = useFlowStore((state) => state.setLoading);
  const setError = useFlowStore((state) => state.setError);

  const createFlow = useCallback(async (description: string, modelUsed?: string) => {
    setLoading(true);
    setError(null);
    try {
      const flow = await api.createFlow({ description, modelUsed });
      addFlow(flow as any);
      return flow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando flujo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addFlow, setLoading, setError]);

  return { createFlow, isLoading: useFlowStore((s) => s.isLoading), error: useFlowStore((s) => s.error) };
}
