/**
 * GitHub App installation wizard types.
 * Used by 5 files in the install-github-app flow.
 */

export type Workflow = 'claude' | 'claude-review'

export interface Warning {
  title: string
  message: string
  instructions: string[]
}

export interface State {
  step: string
  selectedRepoName?: string
  apiKeyOrOAuthToken?: string
  useExistingKey?: boolean
  currentWorkflowInstallStep?: string
  warnings: Warning[]
  secretExists?: boolean
  useExistingSecret?: boolean
  workflowExists?: boolean
  selectedWorkflows: Workflow[]
  selectedApiKeyOption?: string
  authType?: string
  useCurrentRepo?: boolean
  workflowAction?: string
}
