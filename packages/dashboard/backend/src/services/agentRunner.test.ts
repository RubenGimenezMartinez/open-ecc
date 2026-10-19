import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Server as IOServer } from 'socket.io';

const createMockIo = () => {
  const emit = vi.fn();
  const to = vi.fn(() => ({ emit }));
  return { io: ({ emit, to } as unknown as IOServer), emit, to };
};

const AGENT_ORDER = [
  'planner',
  'architect',
  'code-reviewer',
  'tdd-guide',
  'security-reviewer',
  'build-error-resolver',
  'e2e-runner',
];

// Mock de modelos a nivel de módulo para evitar conexión real a MongoDB
vi.mock('../models/Flow', () => ({
  Flow: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));
vi.mock('../models/AgentExecution', () => ({
  AgentExecution: {
    find: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));
vi.mock('../models/ExecutionLog', () => ({
  ExecutionLog: {
    create: vi.fn(),
  },
}));

// Mock de AgentContentGenerator para no leer archivos reales del disco
vi.mock('../lib/agentContentGenerator', () => ({
  AgentContentGenerator: vi.fn(),
}));

// Importar las referencias mockeadas para poder configurarlas con vi.mocked()
import { Flow } from '../models/Flow';
import { AgentExecution } from '../models/AgentExecution';
import { ExecutionLog } from '../models/ExecutionLog';
import { AgentContentGenerator } from '../lib/agentContentGenerator';

const mockFlow = {
  _id: 'flow-1',
  description: 'Calculadora para Windows',
  modelUsed: 'nemotron-3.5-super-vl',
  status: 'pending',
};

const mockAgents = AGENT_ORDER.map((agentName, i) => ({
  id: `agent-${i}`,
  flowId: 'flow-1',
  agentName,
  status: 'pending',
}));

describe('AgentRunner', () => {
  let mockIo: { io: IOServer; emit: ReturnType<typeof vi.fn>; to: ReturnType<typeof vi.fn> };
  let runner: any;
  let mockContentGenerator: AgentContentGenerator;

  beforeEach(async () => {
    mockIo = createMockIo();

    // Configurar valores de retorno de los mocks antes de cada test
    vi.mocked(Flow.findById).mockResolvedValue(mockFlow);
    vi.mocked(AgentExecution.find).mockResolvedValue(mockAgents);
    vi.mocked(ExecutionLog.create).mockResolvedValue({});

    // Crear instancia mockeada del generador de contenido
    mockContentGenerator = {
      generateContent: vi.fn((agentName: string, input: { description: string; model: string }) =>
        `Contenido generado por ${agentName} para "${input.description}" usando ${input.model}`,
      ),
    } as unknown as AgentContentGenerator;
    vi.mocked(AgentContentGenerator).mockReturnValue(mockContentGenerator);

    const mod = await import('./agentRunner');
    runner = new mod.AgentRunner(mockIo.io, 0, mockContentGenerator);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should instantiate AgentRunner and expose runFlow method', () => {
    expect(runner).toBeDefined();
    expect(typeof runner.runFlow).toBe('function');
  });

  it('should execute agents in order and emit agent:status events with outputSummary', async () => {
    await runner.runFlow('flow-1');

    // Verificar flow:status running → completed a través de emit
    const emitCalls = mockIo.emit.mock.calls.map(([event, data]) => ({ event, data }));

    const flowStatusCalls = emitCalls.filter((c) => c.event === 'flow:status');
    expect(flowStatusCalls.length).toBeGreaterThanOrEqual(2);
    expect(flowStatusCalls[0].data.status).toBe('running');
    expect(flowStatusCalls[flowStatusCalls.length - 1].data.status).toBe('completed');

    // Verificar agent:status en orden para cada agente (orden de primera aparición)
    const agentStatusCalls = emitCalls.filter((c) => c.event === 'agent:status');
    const uniqueAgentNames: string[] = [];
    for (const call of agentStatusCalls) {
      if (!uniqueAgentNames.includes(call.data.agentName)) {
        uniqueAgentNames.push(call.data.agentName);
      }
    }
    expect(uniqueAgentNames).toEqual(AGENT_ORDER);

    // Verificar que cada agente pasó por running → completed
    for (const agentName of AGENT_ORDER) {
      const callsForAgent = agentStatusCalls.filter((c) => c.data.agentName === agentName);
      const statuses = callsForAgent.map((c) => c.data.status);
      expect(statuses).toContain('running');
      expect(statuses[statuses.length - 1]).toBe('completed');
    }

    // Verificar que generateContent fue llamado para cada agente
    expect(mockContentGenerator.generateContent).toHaveBeenCalledTimes(AGENT_ORDER.length);

    // Verificar que outputSummary se incluye en los eventos agent:status
    for (const call of agentStatusCalls) {
      expect(call.data.outputSummary).toBeDefined();
      expect(typeof call.data.outputSummary).toBe('string');
      expect(call.data.outputSummary.length).toBeGreaterThan(0);
    }
  });

  it('should emit log:added events', async () => {
    await runner.runFlow('flow-1');

    const logCalls = mockIo.emit.mock.calls.filter(([event]) => event === 'log:added');
    expect(logCalls.length).toBeGreaterThan(0);
  });

  it('should generate content using flow description and model', async () => {
    await runner.runFlow('flow-1');

    // Verificar que generateContent fue llamado con description y model del flow
    const generateContentCalls = vi.mocked(mockContentGenerator.generateContent).mock.calls;
    expect(generateContentCalls.length).toBe(AGENT_ORDER.length);

    // Cada llamada debe tener description y model del flow
    for (const [, input] of generateContentCalls) {
      expect(input.description).toBe('Calculadora para Windows');
      expect(input.model).toBe('nemotron-3.5-super-vl');
    }
  });

  it('should save outputSummary to agent execution', async () => {
    await runner.runFlow('flow-1');

    // Verificar que findByIdAndUpdate fue llamado con outputSummary para cada agente
    const updateCalls = vi.mocked(AgentExecution.findByIdAndUpdate).mock.calls;

    // Debería haber llamadas para running y completed para cada agente (7 agentes × 2 = 14)
    expect(updateCalls.length).toBeGreaterThanOrEqual(AGENT_ORDER.length * 2);

    // Al menos algunas llamadas deben incluir outputSummary
    const callsWithOutputSummary = updateCalls.filter(
      ([, updateData]) => updateData && 'outputSummary' in updateData,
    );
    expect(callsWithOutputSummary.length).toBeGreaterThan(0);
  });
});
