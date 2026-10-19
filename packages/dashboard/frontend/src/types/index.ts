export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused';

export type FlowStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentExecution {
  id: string;
  flowId: string;
  agentName: string;
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  outputSummary?: string;
  errorMessage?: string;
}

export interface ExecutionLog {
  id: string;
  flowId: string;
  agentName?: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  createdAt: string;
}

export interface Flow {
  id: string;
  title: string;
  description: string;
  status: FlowStatus;
  modelUsed: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreateFlowInput {
  description: string;
  modelUsed?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}
