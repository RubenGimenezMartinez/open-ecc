import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlowDetail } from './useFlowDetail';
import { useFlowStore } from '@/store/useFlowStore';
import { api } from '@/services/api';
import type { Flow } from '@/types';

const baseFlow: Flow = {
  id: 'flow-1',
  title: 'Test Flow',
  description: 'Test description',
  status: 'pending',
  modelUsed: 'nemotron-3.5-super-vl',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('@/services/api', () => ({
  api: {
    getFlowById: vi.fn(),
    getAgents: vi.fn(),
    getLogs: vi.fn(),
    getPlan: vi.fn(),
    runFlow: vi.fn(),
  },
}));

vi.mock('@/store/useFlowStore', () => ({
  useFlowStore: vi.fn(),
}));

describe('useFlowDetail', () => {
  const setCurrentFlow = vi.fn();
  const setAgents = vi.fn();
  const setLogs = vi.fn();
  const setLoading = vi.fn();
  const setError = vi.fn();
  const updateFlowStatus = vi.fn();

  const mockStore = {
    setCurrentFlow,
    setAgents,
    setLogs,
    setLoading,
    setError,
    updateFlowStatus,
    currentFlow: baseFlow,
    agents: [],
    logs: [],
    isLoading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFlowStore as ReturnType<typeof vi.fn>).mockImplementation((selector) => selector(mockStore));
    vi.mocked(api.runFlow).mockResolvedValue({ flowId: 'flow-1', status: 'running' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runFlow should call api.runFlow and update flow status to running', async () => {
    const { result } = renderHook(() => useFlowDetail('flow-1'));

    await act(async () => {
      await result.current.runFlow();
    });

    expect(api.runFlow).toHaveBeenCalledWith('flow-1');
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(updateFlowStatus).toHaveBeenCalledWith('flow-1', 'running');
    // setError puede llamarse con null para limpiar, pero no con un mensaje de error real
    const errorCalls = setError.mock.calls.filter((call) => call[0] !== null);
    expect(errorCalls).toHaveLength(0);
  });

  it('runFlow should set error when api.runFlow fails', async () => {
    vi.mocked(api.runFlow).mockRejectedValue(new Error('Error ejecutando flujo'));

    const { result } = renderHook(() => useFlowDetail('flow-1'));

    await act(async () => {
      await result.current.runFlow();
    });

    expect(setError).toHaveBeenCalledWith(expect.stringContaining('Error ejecutando flujo'));
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
