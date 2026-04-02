/**
 * File persistence types for session file tracking.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/session.rs (Session persistence)
 */

export const DEFAULT_UPLOAD_CONCURRENCY = 5
export const FILE_COUNT_LIMIT = 100
export const OUTPUTS_SUBDIR = 'outputs'

export interface PersistedFile {
  path: string
  hash: string
  size: number
  timestamp: number
}

export type TurnStartTime = number

export interface FailedPersistence {
  path: string
  error: string
}

export interface FilesPersistedEventData {
  files: PersistedFile[]
  failed: FailedPersistence[]
  turnStartTime: TurnStartTime
}
