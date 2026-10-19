import { Server as IOServer } from 'socket.io';
import { Flow, AgentExecution, ExecutionLog } from '../models';
import { AgentContentGenerator } from '../lib/agentContentGenerator';

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
  private contentGenerator: AgentContentGenerator;

  constructor(
    io: IOServer,
    agentDelayMs: number = DEFAULT_AGENT_DELAY_MS,
    contentGenerator?: AgentContentGenerator,
  ) {
    this.io = io;
    this.agentDelayMs = agentDelayMs;
    this.contentGenerator = contentGenerator ?? new AgentContentGenerator();
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
    outputSummary?: string,
  ): Promise<void> {
    const updateData: Record<string, unknown> = { status };

    if (status === 'running') updateData.startedAt = new Date();
    if (status === 'completed' || status === 'failed') updateData.completedAt = new Date();
    if (outputSummary) updateData.outputSummary = outputSummary;

    await AgentExecution.findByIdAndUpdate(agentId, updateData, { new: true });

    this.io.to(flowId).emit('agent:status', {
      agentId,
      agentName,
      status,
      outputSummary,
    });
  }

  private async generateAgentContent(
    agentName: AgentName,
    flowDescription: string,
    flowModel: string,
  ): Promise<string> {
    const content = this.contentGenerator.generateContent(agentName, {
      description: flowDescription,
      model: flowModel,
      agentName,
    });

    if (!content) {
      return `Agente ${agentName}: Ejecución completada para el proyecto "${flowDescription}" usando modelo ${flowModel}.`;
    }

    return content;
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

        const agentContent = await this.generateAgentContent(
          agentExecution.agentName,
          flow.description,
          flow.modelUsed,
        );

        await this.updateAgentStatus(
          agentExecution.id,
          flowId,
          agentExecution.agentName,
          'running',
          agentContent,
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
          agentContent,
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
