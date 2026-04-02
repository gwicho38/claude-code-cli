/**
 * Context collapse operations — projects collapsed view of messages.
 * Feature-gated: CONTEXT_COLLAPSE
 */

import type { Message } from '../../types/message.js'

export function projectView(messages: Message[]): Message[] {
  return messages
}
