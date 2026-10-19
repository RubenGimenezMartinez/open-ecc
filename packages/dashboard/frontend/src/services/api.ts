import type { Flow, AgentExecution, ExecutionLog, CreateFlowInput, ApiResponse } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return response.json();
  }

  async getFlows(page = 1, limit = 10, status?: string): Promise<Flow[]> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    const data = await this.request<Flow[]>(`/flows?${params}`);
    return data.data || [];
  }

  async getFlowById(id: string): Promise<Flow> {
    const data = await this.request<Flow>(`/flows/${id}`);
    if (!data.data) throw new Error('Flujo no encontrado');
    return data.data;
  }

  async createFlow(input: CreateFlowInput): Promise<Flow> {
    const data = await this.request<Flow>('/flows', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!data.data) throw new Error('Error creando flujo');
    return data.data;
  }

  async deleteFlow(id: string): Promise<void> {
    await this.request(`/flows/${id}`, { method: 'DELETE' });
  }

  async getAgents(flowId: string): Promise<AgentExecution[]> {
    const data = await this.request<AgentExecution[]>(`/flows/${flowId}/agents`);
    return data.data || [];
  }

  async getLogs(flowId: string): Promise<ExecutionLog[]> {
    const data = await this.request<ExecutionLog[]>(`/flows/${flowId}/logs`);
    return data.data || [];
  }

  async getPlan(flowId: string): Promise<{ planContent?: string }> {
    const data = await this.request<{ planContent?: string }>(`/flows/${flowId}/plan`);
    return data.data || {};
  }

  async runFlow(flowId: string): Promise<{ flowId: string; status: string }> {
    const data = await this.request<{ flowId: string; status: string }>(
      `/flows/${flowId}/run`,
      { method: 'POST' },
    );
    if (!data.data) throw new Error('Error ejecutando flujo');
    return data.data;
  }
}

export const api = new ApiService();
