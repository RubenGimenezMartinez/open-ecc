import { useCallback } from 'react';
import { useFlowStore } from '@/store/useFlowStore';
import type { AgentStatus, FlowStatus } from '@/types';

export function useAgentStatus() {
  const socket = useFlowStore((state) => state.socket);
  const updateAgentStatus = useFlowStore((state) => state.updateAgentStatus);
  const addLog = useFlowStore((state) => state.addLog);
  const updateFlowStatus = useFlowStore((state) => state.updateFlowStatus);

  const handleAgentStatusChange = useCallback(
    (agentId: string, status: AgentStatus) => {
      updateAgentStatus(agentId, status);
    },
    [updateAgentStatus]
  );

  const handleLogAdded = useCallback((log: any) => {
    addLog(log);
  }, [addLog]);

  const handleFlowStatusChange = useCallback(
    (flowId: string, status: FlowStatus) => {
      updateFlowStatus(flowId, status);
    },
    [updateFlowStatus]
  );

  return {
    socket,
    handleAgentStatusChange,
    handleLogAdded,
    handleFlowStatusChange,
    isConnected: !!socket?.connected,
  };
}
