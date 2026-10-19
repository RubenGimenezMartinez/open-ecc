import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentStatus } from './AgentStatus';
import type { AgentStatus as AgentStatusType } from '@/types';

const defaultProps = {
  agentName: 'planner',
  status: 'pending' as AgentStatusType,
};

describe('AgentStatus component', () => {
  it('should render agent name and status label', () => {
    render(<AgentStatus {...defaultProps} />);

    expect(screen.getByText('planner')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('⬜')).toBeInTheDocument();
  });

  it('should render running status with spinner', () => {
    render(<AgentStatus {...defaultProps} status={'running'} />);

    expect(screen.getByText('Ejecutando')).toBeInTheDocument();
    expect(screen.getByText('🔄')).toBeInTheDocument();
  });

  it('should render completed status', () => {
    render(
      <AgentStatus
        {...defaultProps}
        status={'completed'}
        outputSummary={'Plan creado'}
      />
    );

    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('Plan creado')).toBeInTheDocument();
  });

  it('should render failed status with error message', () => {
    render(
      <AgentStatus {...defaultProps} status={'failed'} errorMessage={'Build error'} />
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getByText('Build error')).toBeInTheDocument();
  });

  it('should render paused status', () => {
    render(<AgentStatus {...defaultProps} status={'paused'} />);

    expect(screen.getByText('Pausado')).toBeInTheDocument();
    expect(screen.getByText('⏸️')).toBeInTheDocument();
  });

  it('should render startedAt and completedAt when provided', () => {
    render(
      <AgentStatus
        {...defaultProps}
        status={'completed'}
        startedAt={'2024-01-01T10:00:00Z'}
        completedAt={'2024-01-01T10:05:00Z'}
      />
    );

    expect(screen.getByText(/11:0/)).toBeInTheDocument();
  });
});
