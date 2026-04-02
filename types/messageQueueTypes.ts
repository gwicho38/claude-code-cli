/**
 * Message queue operation types for session persistence.
 *
 * These types record queue operations (enqueue, dequeue, etc.) to the
 * session storage for debugging and replay. Each operation is appended
 * as a JSONL entry via sessionStorage.ts.
 */

/**
 * The set of queue operations that can be performed on the message queue.
 * Used by messageQueueManager.ts to track all queue mutations.
 */
export type QueueOperation =
  | 'enqueue'
  | 'dequeue'
  | 'remove'
  | 'popAll'
  | 'clear'
  | 'reorder'
  | 'prioritize'

/**
 * A single queue operation entry persisted to session storage.
 * Appended via recordQueueOperation() → sessionStorage.insertQueueOperation().
 */
export interface QueueOperationMessage {
  type: 'queue-operation'
  /** Which operation was performed */
  operation: QueueOperation
  /** ISO 8601 timestamp of when the operation occurred */
  timestamp: string
  /** Session ID this operation belongs to */
  sessionId: string
  /** Optional message content associated with the operation */
  content?: string
}
