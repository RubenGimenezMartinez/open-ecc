import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlows } from './useFlows';
import { useFlowStore } from '../store/useFlowStore';
import { api } from '../services/api';
import type { Flow } from '../types';

const baseFlow: Flow = {
  id: 'flow-1',
  title: 'Test Flow',
  description: 'Test description',
  status: 'pending',
  modelUsed: 'nemotron-3.5-super-vl',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('../services/api', () => ({
  api: {
    getFlows: vi.fn(),
    createFlow: vi.fn(),
    deleteFlow: vi.fn(),
  },
}));

describe('useFlows hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useFlowStore.setState({
      flows: [],
      currentFlow: null,
      agents: [],
      logs: [],
      isLoading: false,
      error: null,
      socket: null,
    });
  });

  afterEach(() => {
    useFlowStore.destroy();
  });

  it('loadFlows should fetch flows and update store', async () => {
    vi.mocked(api.getFlows).mockResolvedValue([baseFlow]);

    const { result } = renderHook(() => useFlows());

    await act(async () => {
      await result.current.loadFlows();
    });

    expect(api.getFlows).toHaveBeenCalledWith(1, 10, undefined);
    expect(useFlowStore.getState().flows).toEqual([baseFlow]);
    expect(useFlowStore.getState().isLoading).toBe(false);
    expect(useFlowStore.getState().error).toBe(null);
  });

  it('loadFlows should handle errors', async () => {
    vi.mocked(api.getFlows).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useFlows());

    await act(async () => {
      await result.current.loadFlows();
    });

    expect(useFlowStore.getState().error).toBe('API error');
    expect(useFlowStore.getState().isLoading).toBe(false);
  });

  it('createFlow should call API and return the flow', async () => {
    vi.mocked(api.createFlow).mockResolvedValue(baseFlow);

    const { result } = renderHook(() => useFlows());

    const flow = await act(async () => {
      return await result.current.createFlow('Test description');
    });

    expect(api.createFlow).toHaveBeenCalledWith({
      description: 'Test description',
      modelUsed: undefined,
    });
    expect(flow).toEqual(baseFlow);
    expect(useFlowStore.getState().isLoading).toBe(false);
  });

  it('deleteFlow should call api and set loading states', async () => {
    vi.mocked(api.deleteFlow).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFlows());

    await act(async () => {
      await result.current.deleteFlow('flow-1');
    });

    expect(api.deleteFlow).toHaveBeenCalledWith('flow-1');
    expect(useFlowStore.getState().isLoading).toBe(false);
  });
});
