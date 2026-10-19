import { useCallback } from 'react';
import { useFlowStore } from '@/store/useFlowStore';
import { api } from '@/services/api';

export function useFlows() {
  const setFlows = useFlowStore((state) => state.setFlows);
  const setLoading = useFlowStore((state) => state.setLoading);
  const setError = useFlowStore((state) => state.setError);
  const removeFlow = useFlowStore((state) => state.removeFlow);

  const loadFlows = useCallback(async (page = 1, limit = 10, status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const flows = await api.getFlows(page, limit, status);
      setFlows(flows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando flujos');
    } finally {
      setLoading(false);
    }
  }, [setFlows, setLoading, setError]);

  const createFlow = useCallback(async (description: string, modelUsed?: string) => {
    setLoading(true);
    setError(null);
    try {
      const flow = await api.createFlow({ description, modelUsed });
      return flow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando flujo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteFlow = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.deleteFlow(id);
      removeFlow(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando flujo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, removeFlow]);

  return { flows: useFlowStore((s) => s.flows), loadFlows, createFlow, deleteFlow, isLoading: useFlowStore((s) => s.isLoading), error: useFlowStore((s) => s.error) };
}
