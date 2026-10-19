import { useParams } from 'react-router-dom';
import { useFlowDetail } from '@/hooks/useFlowDetail';
import { AgentTimeline } from '@/components/AgentTimeline';
import { PlanDisplay } from '@/components/PlanDisplay';
import { LogEntry } from '@/components/LogEntry';

export function FlowDetail() {
  const { id } = useParams<{ id: string }>();
  const flowId = id || null;

  const {
    currentFlow,
    agents,
    logs,
    getPlan,
    isLoading,
    error,
  } = useFlowDetail(flowId);

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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentFlow.status === 'completed' ? 'bg-green-100 text-green-800' : currentFlow.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
          {currentFlow.status}
        </span>
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
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Logs</h2>
            <div className="max-h-[400px] overflow-y-auto space-y-1 border border-gray-200 rounded p-2 bg-gray-50">
              {logs.map((log) => (
                <LogEntry key={log.id} log={log} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
