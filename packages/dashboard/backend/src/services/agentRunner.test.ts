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

// Importar las referencias mockeadas para poder configurarlas con vi.mocked()
import { Flow } from '../models/Flow';
import { AgentExecution } from '../models/AgentExecution';
import { ExecutionLog } from '../models/ExecutionLog';

const mockFlow = {
  _id: 'flow-1',
  status: 'pending',
  save: vi.fn().mockResolvedValue(undefined),
};

const mockAgents = AGENT_ORDER.map((agentName, i) => ({
  id: `agent-${i}`,
  flowId: 'flow-1',
  agentName,
  status: 'pending',
  save: vi.fn().mockResolvedValue(undefined),
}));

describe('AgentRunner', () => {
  let mockIo: { io: IOServer; emit: ReturnType<typeof vi.fn>; to: ReturnType<typeof vi.fn> };
  let runner: any;

  beforeEach(async () => {
    mockIo = createMockIo();

    // Configurar valores de retorno de los mocks antes de cada test
    vi.mocked(Flow.findById).mockResolvedValue(mockFlow);
    vi.mocked(AgentExecution.find).mockResolvedValue(mockAgents);
    vi.mocked(ExecutionLog.create).mockResolvedValue({});

    const mod = await import('./agentRunner');
    runner = new mod.AgentRunner(mockIo.io, 0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should instantiate AgentRunner and expose runFlow method', () => {
    expect(runner).toBeDefined();
    expect(typeof runner.runFlow).toBe('function');
  });

  it('should execute agents in order and emit agent:status events', async () => {
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
  });

  it('should emit log:added events', async () => {
    await runner.runFlow('flow-1');

    const logCalls = mockIo.emit.mock.calls.filter(([event]) => event === 'log:added');
    expect(logCalls.length).toBeGreaterThan(0);
  });
});
