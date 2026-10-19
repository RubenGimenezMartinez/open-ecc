import { useFlows } from '@/hooks/useFlows';
import { FlowList } from '@/components/FlowList';

export function History() {
  const { flows, loadFlows, deleteFlow, isLoading, error } = useFlows();

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar este flujo del historial?')) return;
    try {
      await deleteFlow(id);
    } catch {
      // Error manejado en el hook
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial</h1>
        <p className="text-gray-600">Todos los flujos creados anteriormente</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <button
        onClick={() => void loadFlows()}
        className="text-sm text-ecc-600 hover:underline flex items-center gap-1"
      >
        🔄 Refrescar lista
      </button>

      <FlowList flows={flows} onSelect={() => {}} onDelete={handleDelete} isLoading={isLoading} />
    </div>
  );
}
