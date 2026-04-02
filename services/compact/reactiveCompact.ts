/**
 * Reactive compaction — compact-on-demand when context window pressure is high.
 *
 * Translated from:
 *   - Python: claw-code/src/query_engine.py (compact_messages_if_needed)
 */

let reactiveOnlyMode = false

export function isReactiveOnlyMode(): boolean {
  return reactiveOnlyMode
}

export function setReactiveOnlyMode(enabled: boolean): void {
  reactiveOnlyMode = enabled
}
