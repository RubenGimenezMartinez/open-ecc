import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDB, disconnectTestDB } from '../db/connectTest';
import { Flow } from './Flow';
import { ExecutionLog } from './ExecutionLog';
import type { IExecutionLog } from './ExecutionLog';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('ExecutionLog model', () => {
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
    await ExecutionLog.deleteMany({});
  });

  it('debería crear un log de ejecución con valores por defecto', async () => {
    const logData: Partial<IExecutionLog> = {
      flowId,
      agentName: 'planner',
      message: 'Iniciando planificación',
    };

    const log = await ExecutionLog.create(logData);

    expect(log._id).toBeDefined();
    expect(log.flowId.toString()).toBe(flowId.toString());
    expect(log.agentName).toBe('planner');
    expect(log.message).toBe('Iniciando planificación');
    expect(log.level).toBe('info');
    expect(log.createdAt).toBeDefined();
  });

  it('debería requerir flowId y message', async () => {
    await expect(ExecutionLog.create({} as IExecutionLog)).rejects.toThrow();
  });

  it('debería aceptar solo niveles válidos', async () => {
    const log = await ExecutionLog.create({
      flowId,
      message: 'Advertencia',
      level: 'warn',
    });
    expect(log.level).toBe('warn');

    await expect(
      ExecutionLog.create({
        flowId,
        message: 'Test',
        level: 'invalid' as any,
      })
    ).rejects.toThrow();
  });

  it('debería aceptar nivel error', async () => {
    const log = await ExecutionLog.create({
      flowId,
      agentName: 'build-error-resolver',
      message: 'Error en la build',
      level: 'error',
    });
    expect(log.level).toBe('error');
  });
});
