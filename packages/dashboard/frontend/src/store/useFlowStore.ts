import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Flow, AgentExecution, ExecutionLog, AgentStatus, FlowStatus } from '@/types';

interface FlowState {
  flows: Flow[];
  currentFlow: Flow | null;
  agents: AgentExecution[];
  logs: ExecutionLog[];
  isLoading: boolean;
  error: string | null;
  socket: WebSocket | null;

  setFlows: (flows: Flow[]) => void;
  addFlow: (flow: Flow) => void;
  updateFlowStatus: (id: string, status: FlowStatus) => void;
  setCurrentFlow: (flow: Flow | null) => void;
  setAgents: (agents: AgentExecution[]) => void;
  updateAgentStatus: (agentId: string, status: AgentStatus) => void;
  setLogs: (logs: ExecutionLog[]) => void;
  addLog: (log: ExecutionLog) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  connectSocket: (url: string) => void;
  disconnectSocket: () => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set) => ({
      flows: [],
      currentFlow: null,
      agents: [],
      logs: [],
      isLoading: false,
      error: null,
      socket: null,

      setFlows: (flows) => set({ flows }),
      addFlow: (flow) => set((state) => ({ flows: [flow, ...state.flows] })),
      updateFlowStatus: (id, status) =>
        set((state) => ({
          flows: state.flows.map((f) =>
            f.id === id ? { ...f, status } : f
          ),
          currentFlow:
            state.currentFlow?.id === id
              ? { ...state.currentFlow, status }
              : state.currentFlow,
        })),
      setCurrentFlow: (flow) => set({ currentFlow: flow }),
      setAgents: (agents) => set({ agents }),
      updateAgentStatus: (agentId, status) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, status } : a
          ),
        })),
      setLogs: (logs) => set({ logs }),
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      connectSocket: (url) => {
        const socket = new WebSocket(url);
        set({ socket });
        return socket;
      },
      disconnectSocket: () =>
        set((state) => {
          state.socket?.close();
          return { socket: null };
        }),
      reset: () =>
        set({
          flows: [],
          currentFlow: null,
          agents: [],
          logs: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'flow-store',
      partialize: (state) => ({ flows: state.flows }),
    }
  )
);
