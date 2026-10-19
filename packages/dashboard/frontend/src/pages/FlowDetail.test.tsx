import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlowDetail } from './FlowDetail';
import { useFlowDetail } from '@/hooks/useFlowDetail';
import { useFlowStore } from '@/store/useFlowStore';
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

vi.mock('@/hooks/useFlowDetail', () => ({
  useFlowDetail: vi.fn(),
}));

vi.mock('@/store/useFlowStore', () => ({
  useFlowStore: vi.fn(),
}));

describe('FlowDetail page', () => {
  const mockRunFlow = vi.fn();
  const mockGetPlan = vi.fn();
  const mockSocket = { connected: false };

  const mockStore = {
    socket: mockSocket,
    connectSocket: vi.fn(),
    joinFlow: vi.fn(),
    leaveFlow: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useFlowStore as ReturnType<typeof vi.fn>).mockImplementation((selector) => selector(mockStore));
    (useFlowDetail as ReturnType<typeof vi.fn>).mockReturnValue({
      currentFlow: baseFlow,
      agents: [],
      logs: [],
      getPlan: mockGetPlan,
      runFlow: mockRunFlow,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render execute flow button when status is pending', () => {
    render(<FlowDetail />);
    expect(screen.getByRole('button', { name: /Ejecutar flujo/ })).toBeInTheDocument();
  });

  it('should call runFlow when execute button is clicked', () => {
    render(<FlowDetail />);
    fireEvent.click(screen.getByRole('button', { name: /Ejecutar flujo/ }));
    expect(mockRunFlow).toHaveBeenCalled();
  });

  it('should disable execute button when flow is not pending', () => {
    (useFlowDetail as ReturnType<typeof vi.fn>).mockReturnValue({
      currentFlow: { ...baseFlow, status: 'completed' },
      agents: [],
      logs: [],
      getPlan: mockGetPlan,
      runFlow: mockRunFlow,
      isLoading: false,
      error: null,
    } as any);

    render(<FlowDetail />);
    const btn = screen.getByRole('button', { name: /Ejecutar flujo/ });
    expect(btn).toBeDisabled();
  });
});
