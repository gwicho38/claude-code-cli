/**
 * File persistence types for session file tracking.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/session.rs (Session persistence)
 */

export interface PersistedFile {
  path: string
  hash: string
  size: number
  timestamp: number
}

export type TurnStartTime = number
