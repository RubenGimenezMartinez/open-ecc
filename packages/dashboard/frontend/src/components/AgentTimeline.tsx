import type { AgentExecution } from '@/types';
import { AgentStatus } from './AgentStatus';

interface AgentTimelineProps {
  agents: AgentExecution[];
}

const agentOrder: string[] = [
  'planner',
  'architect',
  'code-reviewer',
  'tdd-guide',
  'security-reviewer',
  'build-error-resolver',
  'e2e-runner',
];

export function AgentTimeline({ agents }: AgentTimelineProps) {
  const sortedAgents = [...agents].sort((a, b) => {
    const indexA = agentOrder.indexOf(a.agentName);
    const indexB = agentOrder.indexOf(b.agentName);
    return indexA - indexB;
  });

  if (sortedAgents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay agentes asignados a este flujo aún.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedAgents.map((agent) => (
        <AgentStatus
          key={agent.id}
          agentName={agent.agentName}
          status={agent.status}
          startedAt={agent.startedAt}
          completedAt={agent.completedAt}
          outputSummary={agent.outputSummary}
          errorMessage={agent.errorMessage}
        />
      ))}
    </div>
  );
}
