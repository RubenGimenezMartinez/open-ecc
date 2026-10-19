import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlows } from '@/hooks/useFlows';
import { FlowList } from '@/components/FlowList';

export function Dashboard() {
  const navigate = useNavigate();
  const { flows, loadFlows, deleteFlow, isLoading, error } = useFlows();

  useEffect(() => {
    loadFlows();
  }, [loadFlows]);

  const handleSelect = (id: string) => {
    navigate(`/flow/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este flujo?')) return;
    try {
      await deleteFlow(id);
    } catch {
      // Error ya se maneja en el hook
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Lista de flujos de ejecución ECC</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <FlowList flows={flows} onSelect={handleSelect} onDelete={handleDelete} isLoading={isLoading} />
    </div>
  );
}
