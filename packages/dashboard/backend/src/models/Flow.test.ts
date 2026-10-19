import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectTestDB, disconnectTestDB } from '../db/connectTest';
import { Flow } from './Flow';
import type { IFlow } from './Flow';

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Flow model', () => {
  afterEach(async () => {
    await Flow.deleteMany({});
  });

  it('debería crear un flujo con valores por defecto', async () => {
    const flowData: Partial<IFlow> = {
      title: 'Flujo de prueba',
      description: 'Descripción de prueba',
    };

    const flow = await Flow.create(flowData);

    expect(flow._id).toBeDefined();
    expect(flow.title).toBe('Flujo de prueba');
    expect(flow.description).toBe('Descripción de prueba');
    expect(flow.status).toBe('pending');
    expect(flow.modelUsed).toBe('nemotron-3.5-super-vl');
    expect(flow.createdAt).toBeDefined();
    expect(flow.updatedAt).toBeDefined();
  });

  it('debería requerir título y descripción', async () => {
    await expect(Flow.create({} as IFlow)).rejects.toThrow();
  });

  it('debería aceptar solo estados válidos', async () => {
    const flow = await Flow.create({
      title: 'Test',
      description: 'Test',
      status: 'running',
    });
    expect(flow.status).toBe('running');

    await expect(
      Flow.create({ title: 'Test', description: 'Test', status: 'invalid' as any })
    ).rejects.toThrow();
  });

  it('debería permitir establecer completedAt', async () => {
    const completedAt = new Date();
    const flow = await Flow.create({
      title: 'Test',
      description: 'Test',
      status: 'completed',
      completedAt,
    });
    expect(flow.completedAt).toBeInstanceOf(Date);
  });

  it('debería actualizar updatedAt al modificar', async () => {
    const flow = await Flow.create({
      title: 'Original',
      description: 'Original',
    });
    const originalUpdatedAt = flow.updatedAt;

    await new Promise((resolve) => setTimeout(resolve, 10));

    await Flow.findByIdAndUpdate(flow._id, { title: 'Modificado' });
    const updatedFlow = await Flow.findById(flow._id);

    expect(updatedFlow!.updatedAt.getTime()).toBeGreaterThan(
      originalUpdatedAt.getTime()
    );
  });
});
