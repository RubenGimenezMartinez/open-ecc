import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FlowCard } from './FlowCard';
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

describe('FlowCard component', () => {
  it('should render flow title, description and status', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    render(<FlowCard flow={baseFlow} onClick={onClick} onDelete={onDelete} />);

    expect(screen.getByText('Test Flow')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    render(<FlowCard flow={baseFlow} onClick={onClick} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Test Flow'));
    expect(onClick).toHaveBeenCalledWith('flow-1');
  });

  it('should call onDelete when delete button is clicked', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();

    render(<FlowCard flow={baseFlow} onClick={onClick} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Eliminar'));
    expect(onDelete).toHaveBeenCalledWith('flow-1');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render different status colors', () => {
    const { rerender } = render(
      <FlowCard flow={baseFlow} onClick={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('Pendiente')).toHaveClass('bg-yellow-100');

    rerender(
      <FlowCard flow={{ ...baseFlow, status: 'completed' }} onClick={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Completado')).toHaveClass('bg-green-100');

    rerender(
      <FlowCard flow={{ ...baseFlow, status: 'failed' }} onClick={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Fallido')).toHaveClass('bg-red-100');

    rerender(
      <FlowCard flow={{ ...baseFlow, status: 'running' }} onClick={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText('Ejecutando')).toHaveClass('bg-blue-100');
  });
});
