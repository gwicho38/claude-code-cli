/**
 * Proactive mode — autonomous background actions.
 *
 * Translated from:
 *   - Python: claw-code/src/runtime.py (PortRuntime — proactive routing)
 */

let proactiveActive = false

export function isProactiveActive(): boolean {
  return proactiveActive
}

export function activateProactive(_source: string): void {
  proactiveActive = true
}

export function deactivateProactive(): void {
  proactiveActive = false
}

export default {
  isProactiveActive,
  activateProactive,
  deactivateProactive,
}
