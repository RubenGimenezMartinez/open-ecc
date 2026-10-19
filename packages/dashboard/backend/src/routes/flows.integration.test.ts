import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { connectTestDB, disconnectTestDB } from '../db/connectTest';
import { Flow } from '../models/Flow';
import { AgentExecution } from '../models/AgentExecution';
import { ExecutionLog } from '../models/ExecutionLog';
import express from 'express';
import cors from 'cors';
import flowsRouter from './flows';
import request from 'supertest';

vi.mock('../socket', () => ({
  io: {
    to: vi.fn(() => ({ emit: vi.fn() })),
  },
}));

let app: express.Express;

beforeAll(async () => {
  await connectTestDB();

  app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/flows', flowsRouter);
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await Flow.deleteMany({});
  await AgentExecution.deleteMany({});
  await ExecutionLog.deleteMany({});
});

describe('Flows API Integration', () => {
  it('POST /api/flows - debería crear un nuevo flujo con agentes por defecto', async () => {
    const res = await request(app)
      .post('/api/flows')
      .send({ description: 'Test integration flow' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toContain('Test integration flow');
    expect(res.body.data.status).toBe('pending');

    const agents = await AgentExecution.find({ flowId: res.body.data.id });
    expect(agents).toHaveLength(7);
  });

  it('POST /api/flows - debería rechazar descripción vacía', async () => {
    const res = await request(app)
      .post('/api/flows')
      .send({ description: '' });

    // No debe ser un éxito silencioso (400 o 500, no 201)
    expect(res.status).not.toBe(201);
  });

  it('GET /api/flows - debería listar flujos vacíos', async () => {
    const res = await request(app).get('/api/flows').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.meta.total).toBe(0);
  });

  it('GET /api/flows - debería filtrar por status', async () => {
    await Flow.create({ title: 'Flow 1', description: 'Desc 1', status: 'pending' });
    await Flow.create({ title: 'Flow 2', description: 'Desc 2', status: 'completed' });

    const res = await request(app)
      .get('/api/flows?status=completed')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('completed');
  });

  it('GET /api/flows/:id - debería devolver detalle de un flujo', async () => {
    const flow = await Flow.create({
      title: 'Detail Flow',
      description: 'Detail desc',
      status: 'running',
    });

    const res = await request(app).get(`/api/flows/${flow.id}`).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Detail Flow');
    expect(res.body.data.status).toBe('running');
  });

  it('GET /api/flows/:id - debería devolver 404 para flujo inexistente', async () => {
    const fakeId = new (require('mongoose').Types.ObjectId)().toString();
    await request(app).get(`/api/flows/${fakeId}`).expect(404);
  });

  it('GET /api/flows/:id/agents - debería devolver agentes del flujo', async () => {
    const flow = await Flow.create({
      title: 'Agents Flow',
      description: 'Agents desc',
      status: 'pending',
    });

    await AgentExecution.create({
      flowId: flow._id,
      agentName: 'planner',
      status: 'completed',
    });

    const res = await request(app).get(`/api/flows/${flow.id}/agents`).expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].agentName).toBe('planner');
    expect(res.body.data[0].status).toBe('completed');
  });

  it('GET /api/flows/:id/logs - debería devolver logs del flujo', async () => {
    const flow = await Flow.create({
      title: 'Logs Flow',
      description: 'Logs desc',
      status: 'pending',
    });

    await ExecutionLog.create({
      flowId: flow._id,
      agentName: 'planner',
      message: 'Test log message',
      level: 'info',
    });

    const res = await request(app).get(`/api/flows/${flow.id}/logs`).expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].message).toBe('Test log message');
  });

  it('GET /api/flows/:id/plan - debería devolver plan del flujo', async () => {
    const flow = await Flow.create({
      title: 'Plan Flow',
      description: 'Plan desc',
      status: 'pending',
    });

    await AgentExecution.create({
      flowId: flow._id,
      agentName: 'planner',
      status: 'completed',
      outputSummary: '# Plan de prueba',
    });

    const res = await request(app).get(`/api/flows/${flow.id}/plan`).expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.planContent).toBe('# Plan de prueba');
  });

  it('DELETE /api/flows/:id - debería eliminar flujo y datos relacionados', async () => {
    const flow = await Flow.create({
      title: 'Delete Flow',
      description: 'Delete desc',
      status: 'pending',
    });

    await AgentExecution.create({
      flowId: flow._id,
      agentName: 'planner',
      status: 'pending',
    });

    await ExecutionLog.create({ flowId: flow._id, message: 'Test log' });

    await request(app).delete(`/api/flows/${flow.id}`).expect(200);

    expect(await Flow.findById(flow._id)).toBeNull();
    expect(await AgentExecution.find({ flowId: flow._id })).toHaveLength(0);
    expect(await ExecutionLog.find({ flowId: flow._id })).toHaveLength(0);
  });

  it('GET /api/flows - debería paginar resultados', async () => {
    for (let i = 0; i < 15; i++) {
      await Flow.create({ title: `Flow ${i}`, description: `Desc ${i}`, status: 'pending' });
    }

    const res = await request(app).get('/api/flows?page=1&limit=5').expect(200);

    expect(res.body.data).toHaveLength(5);
    expect(res.body.meta.total).toBe(15);
    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.limit).toBe(5);
  });

  it(
    'POST /api/flows/:id/run - debería iniciar la ejecución y devolver 200',
    async () => {
      const flow = await Flow.create({
        title: 'Run Flow',
        description: 'Desc',
        status: 'pending',
      });
      await AgentExecution.insertMany(
        [
          'planner',
          'architect',
          'code-reviewer',
          'tdd-guide',
          'security-reviewer',
          'build-error-resolver',
          'e2e-runner',
        ].map((agentName) => ({ flowId: flow._id, agentName, status: 'pending' })),
      );

      const res = await request(app)
        .post(`/api/flows/${flow.id}/run`)
        .expect(200);

      expect(res.body.success).toBe(true);

      const updatedFlow = await Flow.findById(flow.id);
      expect(updatedFlow?.status).toBe('completed');

      const agents = await AgentExecution.find({ flowId: flow.id });
      expect(agents.length).toBe(7);
      expect(agents.every((a) => a.status === 'running' || a.status === 'completed')).toBe(true);
    },
    15000,
  );

  it('POST /api/flows/:id/run - debería devolver 404 para flujo inexistente', async () => {
    const fakeId = new (require('mongoose').Types.ObjectId)().toString();
    await request(app).post(`/api/flows/${fakeId}/run`).expect(404);
  });

  it('POST /api/flows/:id/run - debería devolver 400 si el flujo ya está en ejecución', async () => {
    const flow = await Flow.create({
      title: 'Already Running',
      description: 'Desc',
      status: 'running',
    });
    await request(app).post(`/api/flows/${flow.id}/run`).expect(400);
  });

  it('POST /api/flows/:id/run - debería devolver 400 si el flujo ya se completó', async () => {
    const flow = await Flow.create({
      title: 'Already Completed',
      description: 'Desc',
      status: 'completed',
    });
    await request(app).post(`/api/flows/${flow.id}/run`).expect(400);
  });
});
