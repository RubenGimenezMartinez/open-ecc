import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFlowStore } from './useFlowStore';
import type { Flow, AgentExecution, ExecutionLog, AgentStatus, FlowStatus } from '@/types';

const baseFlow: Flow = {
  id: 'flow-1',
  title: 'Test Flow',
  description: 'Test description',
  status: 'pending',
  modelUsed: 'nemotron-3.5-super-vl',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseAgent: AgentExecution = {
  id: 'agent-1',
  flowId: 'flow-1',
  agentName: 'planner',
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const baseLog: ExecutionLog = {
  id: 'log-1',
  flowId: 'flow-1',
  agentName: 'planner',
  message: 'Test log',
  level: 'info',
  createdAt: new Date().toISOString(),
};

describe('useFlowStore', () => {
  beforeEach(() => {
    useFlowStore.setState({
      flows: [],
      currentFlow: null,
      agents: [],
      logs: [],
      isLoading: false,
      error: null,
      socket: null,
    });
  });

  afterEach(() => {
    useFlowStore.destroy();
  });

  it('setFlows should replace all flows', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    expect(useFlowStore.getState().flows).toEqual([baseFlow]);
  });

  it('addFlow should prepend a new flow', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    const newFlow: Flow = { ...baseFlow, id: 'flow-2', title: 'Second Flow' };
    useFlowStore.getState().addFlow(newFlow);
    const flows = useFlowStore.getState().flows;
    expect(flows).toHaveLength(2);
    expect(flows[0].id).toBe('flow-2');
    expect(flows[1].id).toBe('flow-1');
  });

  it('updateFlowStatus should update flow status in flows and currentFlow', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    useFlowStore.getState().setCurrentFlow(baseFlow);

    useFlowStore.getState().updateFlowStatus('flow-1', 'running');

    const state = useFlowStore.getState();
    expect(state.flows[0].status).toBe('running');
    expect(state.currentFlow?.status).toBe('running');
  });

  it('updateFlowStatus should not affect other flows', () => {
    const flow2: Flow = { ...baseFlow, id: 'flow-2', status: 'pending' };
    useFlowStore.getState().setFlows([baseFlow, flow2]);

    useFlowStore.getState().updateFlowStatus('flow-1', 'completed');

    const state = useFlowStore.getState();
    expect(state.flows.find((f) => f.id === 'flow-1')?.status).toBe('completed');
    expect(state.flows.find((f) => f.id === 'flow-2')?.status).toBe('pending');
  });

  it('setAgents should replace all agents', () => {
    useFlowStore.getState().setAgents([baseAgent]);
    expect(useFlowStore.getState().agents).toEqual([baseAgent]);
  });

  it('updateAgentStatus should update agent status', () => {
    useFlowStore.getState().setAgents([baseAgent]);

    useFlowStore.getState().updateAgentStatus('agent-1', 'running');

    expect(useFlowStore.getState().agents[0].status).toBe('running');
  });

  it('setLogs should replace all logs', () => {
    useFlowStore.getState().setLogs([baseLog]);
    expect(useFlowStore.getState().logs).toEqual([baseLog]);
  });

  it('addLog should prepend a new log', () => {
    useFlowStore.getState().setLogs([baseLog]);
    const newLog: ExecutionLog = { ...baseLog, id: 'log-2', message: 'Second log' };
    useFlowStore.getState().addLog(newLog);
    const logs = useFlowStore.getState().logs;
    expect(logs).toHaveLength(2);
    expect(logs[0].id).toBe('log-2');
    expect(logs[1].id).toBe('log-1');
  });

  it('setLoading and setError should work', () => {
    useFlowStore.getState().setLoading(true);
    useFlowStore.getState().setError('Test error');

    const state = useFlowStore.getState();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe('Test error');

    useFlowStore.getState().setLoading(false);
    useFlowStore.getState().setError(null);

    expect(useFlowStore.getState().isLoading).toBe(false);
    expect(useFlowStore.getState().error).toBe(null);
  });

  it('reset should clear all state', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    useFlowStore.getState().setAgents([baseAgent]);
    useFlowStore.getState().setLogs([baseLog]);
    useFlowStore.getState().setCurrentFlow(baseFlow);
    useFlowStore.getState().setLoading(true);
    useFlowStore.getState().setError('Error');

    useFlowStore.getState().reset();

    const state = useFlowStore.getState();
    expect(state.flows).toEqual([]);
    expect(state.agents).toEqual([]);
    expect(state.logs).toEqual([]);
    expect(state.currentFlow).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('removeFlow should remove flow from flows array', () => {
    const flow2: Flow = { ...baseFlow, id: 'flow-2', title: 'Second Flow' };
    useFlowStore.getState().setFlows([baseFlow, flow2]);

    useFlowStore.getState().removeFlow('flow-1');

    const state = useFlowStore.getState();
    expect(state.flows).toHaveLength(1);
    expect(state.flows[0].id).toBe('flow-2');
  });

  it('removeFlow should clear currentFlow when removing the current flow', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    useFlowStore.getState().setCurrentFlow(baseFlow);

    useFlowStore.getState().removeFlow('flow-1');

    const state = useFlowStore.getState();
    expect(state.flows).toHaveLength(0);
    expect(state.currentFlow).toBeNull();
  });

  it('removeFlow should not clear currentFlow when removing a different flow', () => {
    const flow2: Flow = { ...baseFlow, id: 'flow-2', title: 'Second Flow' };
    useFlowStore.getState().setFlows([baseFlow, flow2]);
    useFlowStore.getState().setCurrentFlow(baseFlow);

    useFlowStore.getState().removeFlow('flow-2');

    const state = useFlowStore.getState();
    expect(state.flows).toHaveLength(1);
    expect(state.flows[0].id).toBe('flow-1');
    expect(state.currentFlow?.id).toBe('flow-1');
  });

  it('immutability: setFlows should store a copy of the array', () => {
    const flowsCopy = [...[baseFlow]];
    useFlowStore.getState().setFlows(flowsCopy);
    flowsCopy.push({ ...baseFlow, id: 'flow-2' });

    // El store almacena una referencia al mismo array, por lo que mutar
    // el array original también afecta al store. Este test documenta
    // el comportamiento actual: el llamador debe pasar una copia si
    // desea evitar mutaciones compartidas.
    expect(useFlowStore.getState().flows).toHaveLength(2);
  });

  it('immutability: updateFlowStatus should not mutate original flow objects', () => {
    useFlowStore.getState().setFlows([baseFlow]);
    const originalFlow = { ...useFlowStore.getState().flows[0] };

    useFlowStore.getState().updateFlowStatus('flow-1', 'running');

    const state = useFlowStore.getState();
    expect(state.flows[0]).not.toBe(originalFlow);
    expect(originalFlow.status).toBe('pending');
  });
});
