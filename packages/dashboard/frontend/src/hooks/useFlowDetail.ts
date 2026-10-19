import { useCallback, useEffect } from 'react';
import { useFlowStore } from '@/store/useFlowStore';
import { api } from '@/services/api';

export function useFlowDetail(flowId: string | null) {
  const setCurrentFlow = useFlowStore((state) => state.setCurrentFlow);
  const setAgents = useFlowStore((state) => state.setAgents);
  const setLogs = useFlowStore((state) => state.setLogs);
  const setLoading = useFlowStore((state) => state.setLoading);
  const setError = useFlowStore((state) => state.setError);
  const updateFlowStatus = useFlowStore((state) => state.updateFlowStatus);

  const loadFlow = useCallback(async () => {
    if (!flowId) return;
    setLoading(true);
    setError(null);
    try {
      const [flow, agents, logs] = await Promise.all([
        api.getFlowById(flowId),
        api.getAgents(flowId),
        api.getLogs(flowId),
      ]);
      setCurrentFlow(flow);
      setAgents(agents);
      setLogs(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando detalle del flujo');
    } finally {
      setLoading(false);
    }
  }, [flowId, setCurrentFlow, setAgents, setLogs, setLoading, setError]);

  useEffect(() => {
    loadFlow();
  }, [flowId, loadFlow]);

  const getPlan = useCallback(async () => {
    if (!flowId) return null;
    setLoading(true);
    setError(null);
    try {
      const plan = await api.getPlan(flowId);
      return plan;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando el plan');
      return null;
    } finally {
      setLoading(false);
    }
  }, [flowId, setLoading, setError]);

  const runFlow = useCallback(async () => {
    if (!flowId) return;
    setLoading(true);
    setError(null);
    try {
      await api.runFlow(flowId);
      updateFlowStatus(flowId, 'running');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error ejecutando el flujo');
    } finally {
      setLoading(false);
    }
  }, [flowId, setLoading, setError, updateFlowStatus]);

  return {
    currentFlow: useFlowStore((s) => s.currentFlow),
    agents: useFlowStore((s) => s.agents),
    logs: useFlowStore((s) => s.logs),
    loadFlow,
    getPlan,
    runFlow,
    isLoading: useFlowStore((s) => s.isLoading),
    error: useFlowStore((s) => s.error),
  };
}
