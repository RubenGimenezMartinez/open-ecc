import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFlow } from '@/hooks/useCreateFlow';

export function CreateFlow() {
  const [description, setDescription] = useState('');
  const [modelUsed, setModelUsed] = useState('nemotron-3.5-super-vl');
  const navigate = useNavigate();

  const { createFlow, isLoading, error } = useCreateFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      const flow = await createFlow(description, modelUsed);
      setDescription('');
      navigate(`/flow/${flow.id}`);
    } catch {
      // Error manejado en el hook
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear flujo</h1>
        <p className="text-gray-600">Describe el proyecto que quieres crear</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="flow-description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del proyecto
          </label>
          <textarea
            id="flow-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-ecc-500 focus:border-ecc-500 outline-none"
            placeholder="Ej: Crea un plan para una aplicación de tareas con React y Node.js"
          />
        </div>

        <div>
          <label htmlFor="flow-model" className="block text-sm font-medium text-gray-700 mb-1">
            Modelo de IA
          </label>
          <select
            id="flow-model"
            value={modelUsed}
            onChange={(e) => setModelUsed(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-ecc-500 focus:border-ecc-500 outline-none bg-white"
          >
            <option value="nemotron-3.5-super-vl">Nemotron 3.5 Super VL (gratuito)</option>
          </select>
        </div>

        <button
          type="submit"
          id="start-flow-button"
          disabled={isLoading || !description.trim()}
          className="w-full bg-ecc-600 text-white py-3 rounded-lg font-medium hover:bg-ecc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Iniciando flujo...' : 'Iniciar flujo'}
        </button>
      </form>
    </div>
  );
}
