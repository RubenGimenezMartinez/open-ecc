import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { History } from './History';
import { useFlows } from '@/hooks/useFlows';
import type { Flow } from '@/types';

const baseFlow: Flow = {
  id: 'flow-1',
  title: 'Test Flow',
  description: 'Test description',
  status: 'completed',
  modelUsed: 'nemotron-3.5-super-vl',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

vi.mock('@/hooks/useFlows', () => ({
  useFlows: vi.fn(),
}));

describe('History page', () => {
  const mockLoadFlows = vi.fn();
  const mockDeleteFlow = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFlows).mockReturnValue({
      flows: [baseFlow],
      loadFlows: mockLoadFlows,
      deleteFlow: mockDeleteFlow,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render history heading', () => {
    render(<History />);

    expect(screen.getByRole('heading', { name: /Historial/ })).toBeInTheDocument();
  });

  it('should render flow cards', () => {
    render(<History />);

    expect(screen.getByText('Test Flow')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should call loadFlows when refresh button is clicked', () => {
    render(<History />);

    fireEvent.click(screen.getByText(/Refrescar lista/));

    expect(mockLoadFlows).toHaveBeenCalled();
  });
});
