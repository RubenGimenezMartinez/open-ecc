import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCreateFlow } from './useCreateFlow';
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
    createFlow: vi.fn(),
  },
}));

describe('useCreateFlow hook', () => {
  const mockAddFlow = vi.fn();
  const mockSetLoading = vi.fn();
  const mockSetError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateFlow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create flow and call api', async () => {
    vi.mocked(api.createFlow).mockResolvedValue(baseFlow);

    const { result } = renderHook(() => useCreateFlow());

    const flow = await act(async () => {
      return await result.current.createFlow('Test description');
    });

    expect(api.createFlow).toHaveBeenCalledWith({
      description: 'Test description',
      modelUsed: undefined,
    });
    expect(flow).toEqual(baseFlow);
  });

  it('should handle errors', async () => {
    vi.mocked(api.createFlow).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCreateFlow());

    await expect(
      act(async () => {
        await result.current.createFlow('Test description');
      })
    ).rejects.toThrow('API error');
  });
});
