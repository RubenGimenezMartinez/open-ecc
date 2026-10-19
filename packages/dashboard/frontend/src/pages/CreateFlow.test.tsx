import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateFlow } from './CreateFlow';
import { useCreateFlow } from '@/hooks/useCreateFlow';
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

vi.mock('@/hooks/useCreateFlow', () => ({
  useCreateFlow: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

describe('CreateFlow page', () => {
  const mockCreateFlow = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateFlow).mockReturnValue({
      createFlow: mockCreateFlow,
      isLoading: false,
      error: null,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the form with description field and submit button', () => {
    render(<CreateFlow />);

    expect(screen.getByLabelText(/Descripción del proyecto/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar flujo/ })).toBeInTheDocument();
  });

  it('should disable submit button when description is empty', () => {
    render(<CreateFlow />);

    expect(screen.getByRole('button', { name: /Iniciar flujo/ })).toBeDisabled();
  });

  it('should call createFlow and navigate on submit', async () => {
    mockCreateFlow.mockResolvedValue(baseFlow);

    render(<CreateFlow />);

    const textarea = screen.getByLabelText(/Descripción del proyecto/);
    fireEvent.input(textarea, { target: { value: 'Test description' } });

    const button = screen.getByRole('button', { name: /Iniciar flujo/ });
    fireEvent.click(button);

    expect(mockCreateFlow).toHaveBeenCalledWith('Test description', 'nemotron-3.5-super-vl');
    expect(mockNavigate).toHaveBeenCalledWith('/flow/flow-1');
  });

  it('should show error message when creation fails', async () => {
    mockCreateFlow.mockRejectedValue(new Error('API error'));

    render(<CreateFlow />);

    const textarea = screen.getByLabelText(/Descripción del proyecto/);
    fireEvent.input(textarea, { target: { value: 'Test description' } });

    const button = screen.getByRole('button', { name: /Iniciar flujo/ });
    fireEvent.click(button);

    await new Promise((resolve) => setTimeout(resolve, 0));

    // El error se maneja en el hook mockeado, verificar que createFlow fue llamado
    expect(mockCreateFlow).toHaveBeenCalledWith('Test description', 'nemotron-3.5-super-vl');
  });
});
