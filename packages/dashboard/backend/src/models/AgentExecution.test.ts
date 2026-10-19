import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDB, disconnectTestDB } from '../db/connectTest';
import { Flow } from './Flow';
import { AgentExecution } from './AgentExecution';
import type { IAgentExecution } from './AgentExecution';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('AgentExecution model', () => {
  let flowId: any;

  beforeEach(async () => {
    const flow = await Flow.create({
      title: 'Test Flow',
      description: 'Test description',
    });
    flowId = flow._id;
  });

  afterEach(async () => {
    await Flow.deleteMany({});
    await AgentExecution.deleteMany({});
  });

  it('debería crear una ejecución de agente con valores por defecto', async () => {
    const executionData: Partial<IAgentExecution> = {
      flowId,
      agentName: 'planner',
    };

    const execution = await AgentExecution.create(executionData);

    expect(execution._id).toBeDefined();
    expect(execution.flowId.toString()).toBe(flowId.toString());
    expect(execution.agentName).toBe('planner');
    expect(execution.status).toBe('pending');
    expect(execution.createdAt).toBeDefined();
  });

  it('debería requerir flowId y agentName', async () => {
    await expect(
      AgentExecution.create({} as IAgentExecution)
    ).rejects.toThrow();
  });

  it('debería aceptar solo estados válidos', async () => {
    const execution = await AgentExecution.create({
      flowId,
      agentName: 'architect',
      status: 'running',
    });
    expect(execution.status).toBe('running');

    await expect(
      AgentExecution.create({
        flowId,
        agentName: 'test',
        status: 'invalid' as any,
      })
    ).rejects.toThrow();
  });

  it('debería permitir establecer startedAt y completedAt', async () => {
    const startedAt = new Date();
    const completedAt = new Date(Date.now() + 5000);

    const execution = await AgentExecution.create({
      flowId,
      agentName: 'code-reviewer',
      status: 'completed',
      startedAt,
      completedAt,
      outputSummary: 'Revisión completada exitosamente',
    });

    expect(execution.startedAt).toBeInstanceOf(Date);
    expect(execution.completedAt).toBeInstanceOf(Date);
    expect(execution.outputSummary).toBe('Revisión completada exitosamente');
  });

  it('debería permitir establecer errorMessage cuando falla', async () => {
    const execution = await AgentExecution.create({
      flowId,
      agentName: 'tdd-guide',
      status: 'failed',
      errorMessage: 'Error de compilación',
    });

    expect(execution.errorMessage).toBe('Error de compilación');
  });
});
