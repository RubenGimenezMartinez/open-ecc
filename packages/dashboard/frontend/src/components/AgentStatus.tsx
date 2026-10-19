import type { AgentStatus } from '@/types';

interface AgentStatusProps {
  agentName: string;
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  outputSummary?: string;
  errorMessage?: string;
}

const statusConfig: Record<AgentStatus, { label: string; color: string; icon: string }> = {
  pending: { label: 'Pendiente', color: 'text-gray-500', icon: '⬜' },
  running: { label: 'Ejecutando', color: 'text-blue-500', icon: '🔄' },
  completed: { label: 'Completado', color: 'text-green-500', icon: '✅' },
  failed: { label: 'Error', color: 'text-red-500', icon: '❌' },
  paused: { label: 'Pausado', color: 'text-yellow-500', icon: '⏸️' },
};

export function AgentStatus({ agentName, status, startedAt, completedAt, outputSummary, errorMessage }: AgentStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-lg">{config.icon}</span>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="font-medium text-gray-800">{agentName}</span>
          <span className={`text-xs font-semibold ${config.color} uppercase tracking-wider`}>
            {config.label}
          </span>
        </div>
        {status === 'running' && (
          <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" />
          </div>
        )}
        {status === 'completed' && outputSummary && (
          <p className="mt-1 text-xs text-gray-600 truncate max-w-md">{outputSummary}</p>
        )}
        {status === 'failed' && errorMessage && (
          <p className="mt-1 text-xs text-red-600 truncate max-w-md">{errorMessage}</p>
        )}
        {startedAt && completedAt && (
          <span className="text-xs text-gray-500">
            {new Date(startedAt).toLocaleTimeString()} → {new Date(completedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
