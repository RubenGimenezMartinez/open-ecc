interface PlanDisplayProps {
  planContent: string | null;
  status: string;
}

export function PlanDisplay({ planContent, status }: PlanDisplayProps) {
  if (!planContent) {
    return (
      <div className="p-4 bg-gray-50 rounded border border-gray-200 text-center text-gray-500">
        <p>No hay plan disponible aún.</p>
        {status === 'pending' && <p className="text-xs mt-2">El agente planner generará el plan cuando el flujo inicie.</p>}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">Plan generado</h4>
        <span className="text-xs font-medium text-green-600">Disponible</span>
      </div>
      <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">{planContent}</pre>
    </div>
  );
}
