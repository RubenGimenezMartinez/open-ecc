import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentTimeline } from './AgentTimeline';
import type { AgentExecution } from '@/types';

const baseAgent: AgentExecution = {
  id: 'agent-1',
  flowId: 'flow-1',
  agentName: 'planner',
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('AgentTimeline component', () => {
  it('should render agents sorted by order', () => {
    const agents = [
      { ...baseAgent, agentName: 'e2e-runner', id: 'agent-7' },
      { ...baseAgent, agentName: 'planner', id: 'agent-1' },
      { ...baseAgent, agentName: 'architect', id: 'agent-2' },
    ];

    render(<AgentTimeline agents={agents} />);

    expect(screen.getByText('planner')).toBeInTheDocument();
    expect(screen.getByText('architect')).toBeInTheDocument();
    expect(screen.getByText('e2e-runner')).toBeInTheDocument();
  });

  it('should show empty state when no agents', () => {
    render(<AgentTimeline agents={[]} />);

    expect(screen.getByText(/No hay agentes asignados/)).toBeInTheDocument();
  });

  it('should render all agent statuses', () => {
    const agents = [
      { ...baseAgent, agentName: 'planner', status: 'pending', id: 'agent-1' },
      { ...baseAgent, agentName: 'architect', status: 'running', id: 'agent-2' },
      { ...baseAgent, agentName: 'code-reviewer', status: 'completed', id: 'agent-3' },
      { ...baseAgent, agentName: 'tdd-guide', status: 'failed', id: 'agent-4' },
      { ...baseAgent, agentName: 'security-reviewer', status: 'paused', id: 'agent-5' },
    ];

    render(<AgentTimeline agents={agents} />);

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Ejecutando')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Pausado')).toBeInTheDocument();
  });
});
