import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, type Socket } from 'socket.io-client';
import type { Flow, AgentExecution, ExecutionLog, AgentStatus, FlowStatus } from '@/types';

interface FlowState {
  flows: Flow[];
  currentFlow: Flow | null;
  agents: AgentExecution[];
  logs: ExecutionLog[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;

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
  joinFlow: (flowId: string) => void;
  leaveFlow: (flowId: string) => void;
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
      removeFlow: (id) =>
        set((state) => ({
          flows: state.flows.filter((f) => f.id !== id),
          currentFlow:
            state.currentFlow?.id === id ? null : state.currentFlow,
        })),
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
        const socket = io(url, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
          console.log('[WS] Conectado:', socket.id);
        });

        socket.on('disconnect', () => {
          console.log('[WS] Desconectado');
        });

        socket.on('connect_error', (err) => {
          console.error('[WS] Error de conexión:', err.message);
          set({ error: 'No se pudo conectar al servidor de tiempo real' });
        });

        // Escuchar eventos de estado de agentes
        socket.on('agent:status', (data: { agentId: string; status: AgentStatus }) => {
          set((state) => ({
            agents: state.agents.map((a) =>
              a.id === data.agentId ? { ...a, status: data.status } : a
            ),
          }));
        });

        // Escuchar eventos de logs
        socket.on('log:added', (data: ExecutionLog) => {
          set((state) => ({ logs: [data, ...state.logs] }));
        });

        // Escuchar eventos de cambio de estado de flujo
        socket.on('flow:status', (data: { flowId: string; status: FlowStatus }) => {
          set((state) => ({
            flows: state.flows.map((f) =>
              f.id === data.flowId ? { ...f, status: data.status } : f
            ),
            currentFlow:
              state.currentFlow?.id === data.flowId
                ? { ...state.currentFlow, status: data.status }
                : state.currentFlow,
          }));
        });

        set({ socket });
      },
      disconnectSocket: () =>
        set((state) => {
          state.socket?.disconnect();
          return { socket: null };
        }),
      joinFlow: (flowId) => {
        set((state) => {
          state.socket?.emit('join-flow', flowId);
          return state;
        });
      },
      leaveFlow: (flowId) => {
        set((state) => {
          state.socket?.emit('leave-flow', flowId);
          return state;
        });
      },
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
