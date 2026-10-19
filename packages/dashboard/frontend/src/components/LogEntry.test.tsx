import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogEntry } from './LogEntry';
import type { ExecutionLog } from '@/types';

const baseLog: ExecutionLog = {
  id: 'log-1',
  flowId: 'flow-1',
  agentName: 'planner',
  message: 'Test message',
  level: 'info',
  createdAt: new Date().toISOString(),
};

describe('LogEntry component', () => {
  it('should render log message, level and time', () => {
    render(<LogEntry log={baseLog} />);

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('INFO')).toBeInTheDocument();
  });

  it('should render different level colors', () => {
    const { rerender } = render(<LogEntry log={baseLog} />);

    expect(screen.getByText('INFO')).toHaveClass('text-blue-600');

    rerender(<LogEntry log={{ ...baseLog, level: 'warn' }} />);
    expect(screen.getByText('WARN')).toHaveClass('text-yellow-600');

    rerender(<LogEntry log={{ ...baseLog, level: 'error' }} />);
    expect(screen.getByText('ERROR')).toHaveClass('text-red-600');
  });
});
