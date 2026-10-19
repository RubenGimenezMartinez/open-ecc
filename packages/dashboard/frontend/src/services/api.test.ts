import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

const mockResponse = { success: true, data: { flowId: 'flow-1', status: 'running' } };

describe('ApiService.runFlow', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should call POST /api/flows/:id/run and return data', async () => {
    const result = await api.runFlow('flow-1');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/flows/flow-1/run',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw when response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Flujo no encontrado' }),
    } as Response);

    await expect(api.runFlow('flow-99')).rejects.toThrow('Flujo no encontrado');
  });
});
