import type { Flow } from '@/types';

interface FlowCardProps {
  flow: Flow;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<Flow['status'], { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  running: { label: 'Ejecutando', color: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completado', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Fallido', color: 'bg-red-100 text-red-800' },
};

export function FlowCard({ flow, onClick, onDelete }: FlowCardProps) {
  const config = statusConfig[flow.status];

  return (
    <div
      className="group cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-ecc-500 transition-all"
      onClick={() => onClick(flow.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 truncate max-w-[200px]">{flow.title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${config.color}`}>
          {config.label}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{flow.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{new Date(flow.createdAt).toLocaleDateString('es-ES')}</span>
        <span>Modelo: {flow.modelUsed}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(flow.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-xs font-medium"
      >
        Eliminar
      </button>
    </div>
  );
}
