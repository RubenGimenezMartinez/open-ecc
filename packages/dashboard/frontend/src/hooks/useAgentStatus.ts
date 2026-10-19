import { useCallback } from 'react';
import { useFlowStore } from '@/store/useFlowStore';

export function useAgentStatus() {
  const updateAgentStatus = useFlowStore((state) => state.updateAgentStatus);
  const addLog = useFlowStore((state) => state.addLog);
  const updateFlowStatus = useFlowStore((state) => state.updateFlowStatus);

  const handleAgentStatusChange = useCallback((agentId: string, status: string) => {
    updateAgentStatus(agentId, status as any);
  }, [updateAgentStatus]);

  const handleLogAdded = useCallback((log: any) => {
    addLog(log);
  }, [addLog]);

  const handleFlowStatusChange = useCallback((flowId: string, status: string) => {
    updateFlowStatus(flowId, status as any);
  }, [updateFlowStatus]);

  return { handleAgentStatusChange, handleLogAdded, handleFlowStatusChange };
}
