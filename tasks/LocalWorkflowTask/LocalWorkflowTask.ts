/**
 * Local workflow background task.
 * Feature-gated: WORKFLOW_SCRIPTS
 */

export interface LocalWorkflowTaskState {
  type: 'local_workflow'
  id: string
  status: 'running' | 'pending' | 'completed' | 'failed'
  agentControllers?: unknown[]
}

export const LocalWorkflowTask: any = null

export function killWorkflowTask(_taskId: string): void {}

export function skipWorkflowAgent(_taskId: string, _agentId: string): void {}

export function retryWorkflowAgent(_taskId: string, _agentId: string): void {}
