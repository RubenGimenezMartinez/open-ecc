import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useFlowDetail } from '@/hooks/useFlowDetail';
import { AgentTimeline } from '@/components/AgentTimeline';
import { PlanDisplay } from '@/components/PlanDisplay';
import { LogEntry } from '@/components/LogEntry';
import { useFlowStore } from '@/store/useFlowStore';

export function FlowDetail() {
  const { id } = useParams<{ id: string }>();
  const flowId = id || null;

  const {
    currentFlow,
    agents,
    logs,
    getPlan,
    runFlow,
    isLoading,
    error,
  } = useFlowDetail(flowId);

  const canRun = currentFlow?.status === 'pending';

  const socket = useFlowStore((state) => state.socket);
  const joinFlow = useFlowStore((state) => state.joinFlow);
  const leaveFlow = useFlowStore((state) => state.leaveFlow);

  const connectSocket = useFlowStore((state) => state.connectSocket);

  // Conectar al WebSocket y unirse a la sala del flujo
  useEffect(() => {
    if (!socket) {
      connectSocket(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000');
    }
    if (flowId && socket) {
      joinFlow(flowId);
    }

    return () => {
      if (flowId && socket) {
        leaveFlow(flowId);
      }
    };
  }, [flowId, socket, connectSocket, joinFlow, leaveFlow]);

  if (isLoading && !currentFlow) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        Cargando flujo...
      </div>
    );
  }

  if (!currentFlow) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Flujo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentFlow.title}</h1>
          <p className="text-gray-600">{currentFlow.description}</p>
        </div>
        <div className="flex items-end gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentFlow.status === 'completed' ? 'bg-green-100 text-green-800' : currentFlow.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
            {currentFlow.status}
          </span>
          <button
            onClick={runFlow}
            disabled={!canRun || isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              canRun && !isLoading
                ? 'bg-ecc-600 text-white hover:bg-ecc-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Ejecutando...' : 'Ejecutar flujo'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Agentes</h2>
            <AgentTimeline agents={agents} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Plan generado</h2>
            <PlanDisplay planContent={null} status={currentFlow.status} />
            <button
              onClick={() => void getPlan()}
              className="mt-3 text-sm text-ecc-600 hover:underline"
            >
              Refrescar plan
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Logs</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${socket?.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {socket?.connected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-1 border border-gray-200 rounded p-2 bg-gray-50">
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
