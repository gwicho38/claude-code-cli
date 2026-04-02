/**
 * Snip projection — projects a snipped view of messages.
 * Feature-gated: HISTORY_SNIP
 */

import type { Message } from '../../types/message.js'

export function isSnipBoundaryMessage(_message: Message): boolean {
  return false
}

export function projectSnippedView(messages: Message[]): Message[] {
  return messages
}
