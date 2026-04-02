/**
 * Query loop state transitions.
 *
 * Translated from:
 *   - Python: claw-code/src/query_engine.py (TurnResult.stop_reason)
 *   - Rust: claw-code/rust/crates/runtime/src/session.rs (MessageRole flow)
 */

/** Terminal state — query loop should stop. */
export interface Terminal {
  kind: 'terminal'
  reason: string
}

/** Continue state — query loop should proceed with another turn. */
export interface Continue {
  kind: 'continue'
}

export type Transition = Terminal | Continue

export function terminal(reason: string): Terminal {
  return { kind: 'terminal', reason }
}

export function continueLoop(): Continue {
  return { kind: 'continue' }
}
