/**
 * React hook for proactive mode UI integration.
 * Feature-gated: PROACTIVE
 */

export function useProactive(): {
  isActive: boolean
  activate: () => void
  deactivate: () => void
} {
  return {
    isActive: false,
    activate: () => {},
    deactivate: () => {},
  }
}
