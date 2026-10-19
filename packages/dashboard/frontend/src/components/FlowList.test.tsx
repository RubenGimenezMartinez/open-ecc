import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlowList } from './FlowList';
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

describe('FlowList component', () => {
  it('should show loading state when isLoading is true', () => {
    render(<FlowList flows={[]} onSelect={vi.fn()} onDelete={vi.fn()} isLoading />);

    expect(screen.getByText(/Cargando flujos/)).toBeInTheDocument();
  });

  it('should show empty state when no flows', () => {
    render(<FlowList flows={[]} onSelect={vi.fn()} onDelete={vi.fn()} isLoading={false} />);

    expect(screen.getByText(/No hay flujos creados/)).toBeInTheDocument();
  });

  it('should render all flows', () => {
    const flows = [
      baseFlow,
      { ...baseFlow, id: 'flow-2', title: 'Second Flow' },
    ];

    render(<FlowList flows={flows} onSelect={vi.fn()} onDelete={vi.fn()} isLoading={false} />);

    expect(screen.getByText('Test Flow')).toBeInTheDocument();
    expect(screen.getByText('Second Flow')).toBeInTheDocument();
  });

  it('should call onSelect when a flow card is clicked', () => {
    const onSelect = vi.fn();
    const onDelete = vi.fn();

    render(<FlowList flows={[baseFlow]} onSelect={onSelect} onDelete={onDelete} isLoading={false} />);

    fireEvent.click(screen.getByText('Test Flow'));
    expect(onSelect).toHaveBeenCalledWith('flow-1');
  });
});
