/**
 * Agent creation wizard types.
 * Used by 13 wizard step components and CreateAgentWizard.
 */

import type { AgentDefinition } from '../../../tools/AgentTool/builtInAgents.js'

export interface AgentWizardData {
  generationPrompt?: string
  selectedModel?: string
  whenToUse?: string
  systemPrompt?: string
  location?: 'userSettings' | 'projectSettings'
  selectedTools?: string[]
  agentType?: string
  wasGenerated?: boolean
  finalAgent?: AgentDefinition
  color?: string
  memory?: boolean
}
