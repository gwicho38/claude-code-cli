/**
 * Tool progress types — used by UI components to render tool execution state.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/api/src/types.rs (ToolDefinition)
 *   - Python: claw-code/src/tools.py (ToolExecution)
 *   - Python: claw-code/src/execution_registry.py (MirroredTool)
 */

export interface BaseProgress {
  type: string
  toolUseId: string
  label?: string
}

export interface BashProgress extends BaseProgress {
  type: 'bash'
  command?: string
  output?: string
  exitCode?: number
}

export interface ShellProgress extends BaseProgress {
  type: 'shell'
  command?: string
  output?: string
  exitCode?: number
}

export interface PowerShellProgress extends BaseProgress {
  type: 'powershell'
  command?: string
  output?: string
  exitCode?: number
}

export interface MCPProgress extends BaseProgress {
  type: 'mcp'
  serverName?: string
  toolName?: string
  progress?: number
}

export interface WebSearchProgress extends BaseProgress {
  type: 'web_search'
  query?: string
  resultsCount?: number
}

export interface AgentToolProgress extends BaseProgress {
  type: 'agent'
  agentName?: string
  status?: string
}

export interface SkillToolProgress extends BaseProgress {
  type: 'skill'
  skillName?: string
  status?: string
}

export interface TaskOutputProgress extends BaseProgress {
  type: 'task_output'
  taskId?: string
  status?: string
}

export interface SdkWorkflowProgress extends BaseProgress {
  type: 'sdk_workflow'
  workflowId?: string
  step?: string
}

export type Progress =
  | BashProgress
  | ShellProgress
  | PowerShellProgress
  | MCPProgress
  | WebSearchProgress
  | AgentToolProgress
  | SkillToolProgress
  | TaskOutputProgress
  | SdkWorkflowProgress
