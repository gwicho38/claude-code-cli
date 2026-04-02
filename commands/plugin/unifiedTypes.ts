/**
 * Unified installed item types for plugin management UI.
 */

export type UnifiedInstalledItem =
  | {
      type: 'plugin'
      id: string
      name: string
      marketplace: string
      scope: string
      indented?: boolean
    }
  | {
      type: 'mcp'
      id: string
      name: string
      marketplace?: string
      scope: string
      indented?: boolean
    }
  | {
      type: 'failed-plugin'
      id: string
      name: string
      marketplace: string
      scope: string
      errors: Array<{ message: string }>
    }
  | {
      type: 'flagged-plugin'
      id: string
      name: string
      marketplace: string
      scope: string
      reason?: string
    }
