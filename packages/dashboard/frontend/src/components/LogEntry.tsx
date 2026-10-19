import type { ExecutionLog } from '@/types';

interface LogEntryProps {
  log: ExecutionLog;
}

const levelConfig: Record<ExecutionLog['level'], { color: string; label: string }> = {
  info: { color: 'text-blue-600', label: 'INFO' },
  warn: { color: 'text-yellow-600', label: 'WARN' },
  error: { color: 'text-red-600', label: 'ERROR' },
};

export function LogEntry({ log }: LogEntryProps) {
  const config = levelConfig[log.level];
  const time = new Date(log.createdAt).toLocaleTimeString('es-ES');

  return (
    <div className="flex gap-3 p-2 bg-gray-50 rounded border border-gray-100">
      <span className={`text-xs font-mono ${config.color} w-16`}>{config.label}</span>
      <span className="text-xs text-gray-500 font-mono w-20">{time}</span>
      <p className="text-sm text-gray-800 break-words">{log.message}</p>
    </div>
  );
}
