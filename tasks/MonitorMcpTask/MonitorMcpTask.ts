/**
 * MCP monitoring background task.
 * Feature-gated: MONITOR_TOOL
 */

export interface MonitorMcpTaskState {
  type: 'monitor_mcp'
  id: string
  status: 'running' | 'pending' | 'completed' | 'failed'
  agentId?: string
}

export const MonitorMcpTask: any = null

export function killMonitorMcpTasksForAgent(_agentId: string): void {}

export function killMonitorMcp(): void {}
