import { Request, Response } from 'express';
import { Flow, AgentExecution, ExecutionLog } from '../models';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { z } from 'zod';

const createFlowSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida').max(5000),
  modelUsed: z.string().optional().default('nemotron-3.5-super-vl'),
});

export const getFlows = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const status = req.query.status as string;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (status) {
    filter.status = status;
  }

  const [flows, total] = await Promise.all([
    Flow.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Flow.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: flows,
    meta: { total, page, limit },
  });
});

export const getFlowById = asyncHandler(async (req: Request, res: Response) => {
  const flow = await Flow.findById(req.params.id).lean();

  if (!flow) {
    throw new AppError('Flujo no encontrado', 404);
  }

  res.json({ success: true, data: flow });
});

export const createFlow = asyncHandler(async (req: Request, res: Response) => {
  const validated = createFlowSchema.parse(req.body);

  const flow = await Flow.create({
    title: `Flujo: ${validated.description.slice(0, 60)}`,
    description: validated.description,
    status: 'pending',
    modelUsed: validated.modelUsed,
  });

  // Crear ejecución pendiente para cada agente por defecto
  const defaultAgents = [
    'planner',
    'architect',
    'code-reviewer',
    'tdd-guide',
    'security-reviewer',
    'build-error-resolver',
    'e2e-runner',
  ];

  await AgentExecution.insertMany(
    defaultAgents.map((agentName) => ({
      flowId: flow._id,
      agentName,
      status: 'pending',
    }))
  );

  await ExecutionLog.create({
    flowId: flow._id,
    message: 'Flujo creado. Aguardando ejecución del agente planner.',
    level: 'info',
  });

  res.status(201).json({ success: true, data: flow });
});

export const deleteFlow = asyncHandler(async (req: Request, res: Response) => {
  const flow = await Flow.findById(req.params.id);

  if (!flow) {
    throw new AppError('Flujo no encontrado', 404);
  }

  await Flow.deleteOne({ _id: req.params.id });
  await AgentExecution.deleteMany({ flowId: req.params.id });
  await ExecutionLog.deleteMany({ flowId: req.params.id });

  res.json({ success: true, data: { id: req.params.id } });
});

export const getAgents = asyncHandler(async (req: Request, res: Response) => {
  const agents = await AgentExecution.find({ flowId: req.params.id })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ success: true, data: agents });
});

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const logs = await ExecutionLog.find({ flowId: req.params.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({ success: true, data: logs });
});

export const getPlan = asyncHandler(async (req: Request, res: Response) => {
  const flow = await Flow.findById(req.params.id).lean();

  if (!flow) {
    throw new AppError('Flujo no encontrado', 404);
  }

  const planAgent = await AgentExecution.findOne({
    flowId: req.params.id,
    agentName: 'planner',
  }).lean();

  res.json({
    success: true,
    data: {
      flowId: flow._id,
      title: flow.title,
      description: flow.description,
      planContent: planAgent?.outputSummary || null,
      status: flow.status,
    },
  });
});

export default {
  getFlows,
  getFlowById,
  createFlow,
  deleteFlow,
  getAgents,
  getLogs,
  getPlan,
};
