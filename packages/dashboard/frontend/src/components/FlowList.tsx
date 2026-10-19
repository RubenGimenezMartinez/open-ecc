import type { Flow } from '@/types';
import { FlowCard } from './FlowCard';

interface FlowListProps {
  flows: Flow[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function FlowList({ flows, onSelect, onDelete, isLoading }: FlowListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        Cargando flujos...
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay flujos creados aún</p>
        <p className="text-sm">Crea tu primer flujo desde la pestaña "Crear flujo"</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onClick={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
