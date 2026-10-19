import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { useFlows } from '@/hooks/useFlows';
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

vi.mock('@/hooks/useFlows', () => ({
  useFlows: vi.fn(),
}));

describe('Dashboard page', () => {
  const mockLoadFlows = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useFlows).mockReturnValue({
      flows: [baseFlow],
      loadFlows: mockLoadFlows,
      deleteFlow: vi.fn(),
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render dashboard heading', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: /Dashboard/ })).toBeInTheDocument();
  });

  it('should render flow card', () => {
    render(<Dashboard />);

    expect(screen.getByText('Test Flow')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should call loadFlows on mount', () => {
    render(<Dashboard />);

    expect(mockLoadFlows).toHaveBeenCalled();
  });

  it('should show error message when present', () => {
    vi.mocked(useFlows).mockReturnValue({
      flows: [],
      loadFlows: mockLoadFlows,
      deleteFlow: vi.fn(),
      isLoading: false,
      error: 'Test error',
    } as any);

    render(<Dashboard />);

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
