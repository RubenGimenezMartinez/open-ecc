import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from '@/pages/Dashboard';
import { CreateFlow } from '@/pages/CreateFlow';
import { FlowDetail } from '@/pages/FlowDetail';
import { History } from '@/pages/History';
import { useFlowStore } from '@/store/useFlowStore';

export function App() {
  const connectSocket = useFlowStore((state) => state.connectSocket);

  useEffect(() => {
    connectSocket(
      import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000'
    );

    return () => {
      // Limpieza al desmontar
    };
  }, [connectSocket]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-ecc-900 text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <span>🤖</span> ECC Flow Manager
            </Link>
            <div className="flex gap-4">
              <Link to="/" className="px-3 py-2 text-sm hover:bg-ecc-800 rounded transition-colors">
                Dashboard
              </Link>
              <Link to="/create" className="px-3 py-2 text-sm hover:bg-ecc-800 rounded transition-colors">
                Crear flujo
              </Link>
              <Link to="/history" className="px-3 py-2 text-sm hover:bg-ecc-800 rounded transition-colors">
                Historial
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateFlow />} />
            <Route path="/flow/:id" element={<FlowDetail />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
