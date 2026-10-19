import { Server as IOServer } from 'socket.io';
import { Flow, AgentExecution, ExecutionLog } from '../models';

export const AGENT_ORDER = [
  'planner',
  'architect',
  'code-reviewer',
  'tdd-guide',
  'security-reviewer',
  'build-error-resolver',
  'e2e-runner',
] as const;

export type AgentName = (typeof AGENT_ORDER)[number];

export const DEFAULT_AGENT_DELAY_MS = 1000;

const isValidAgentName = (name: string): name is AgentName =>
  AGENT_ORDER.includes(name as AgentName);

export class AgentRunner {
  private io: IOServer;
  private agentDelayMs: number;

  constructor(io: IOServer, agentDelayMs: number = DEFAULT_AGENT_DELAY_MS) {
    this.io = io;
    this.agentDelayMs = agentDelayMs;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async emitLog(
    flowId: string,
    agentName: AgentName | null,
    message: string,
    level: 'info' | 'warn' | 'error' = 'info',
  ): Promise<void> {
    const log = await ExecutionLog.create({ flowId, agentName, message, level });
    this.io.to(flowId).emit('log:added', log);
  }

  private async updateAgentStatus(
    agentId: string,
    flowId: string,
    agentName: AgentName,
    status: AgentExecution['status'],
  ): Promise<void> {
    const updateData: Record<string, unknown> = { status };

    if (status === 'running') updateData.startedAt = new Date();
    if (status === 'completed' || status === 'failed') updateData.completedAt = new Date();

    await AgentExecution.findByIdAndUpdate(agentId, updateData, { new: true });

    this.io.to(flowId).emit('agent:status', {
      agentId,
      agentName,
      status,
    });
  }

  async runFlow(flowId: string): Promise<void> {
    const flow = await Flow.findById(flowId);

    if (!flow) {
      throw new Error('Flujo no encontrado');
    }

    try {
      await Flow.findByIdAndUpdate(flowId, { status: 'running' }, { new: true });
      this.io.to(flowId).emit('flow:status', { flowId, status: 'running' });

      await this.emitLog(flowId, null, 'Iniciando ejecución del flujo', 'info');

      const agentExecutions = (await AgentExecution.find({ flowId })).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      for (const agentExecution of agentExecutions) {
        if (!isValidAgentName(agentExecution.agentName)) {
          throw new Error(`Agente desconocido: ${agentExecution.agentName}`);
        }

        await this.updateAgentStatus(
          agentExecution.id,
          flowId,
          agentExecution.agentName,
          'running',
        );
        await this.emitLog(
          flowId,
          agentExecution.agentName,
          `Ejecutando agente ${agentExecution.agentName}`,
          'info',
        );

        await this.delay(this.agentDelayMs);

        await this.updateAgentStatus(
          agentExecution.id,
          flowId,
          agentExecution.agentName,
          'completed',
        );
        await this.emitLog(
          flowId,
          agentExecution.agentName,
          `Agente ${agentExecution.agentName} completado`,
          'info',
        );
      }

      await Flow.findByIdAndUpdate(flowId, { status: 'completed' }, { new: true });
      this.io.to(flowId).emit('flow:status', { flowId, status: 'completed' });

      await this.emitLog(flowId, null, 'Ejecución del flujo completada', 'info');
    } catch (error) {
      await Flow.findByIdAndUpdate(flowId, { status: 'failed' }, { new: true });
      this.io.to(flowId).emit('flow:status', { flowId, status: 'failed' });
      await this.emitLog(
        flowId,
        null,
        `Error en ejecución: ${error instanceof Error ? error.message : String(error)}`,
        'error',
      );
      throw error;
    }
  }
}
