/**
 * Session transcript — writes conversation segments for long-running sessions.
 * Feature-gated: KAIROS
 */

import type { Message } from '../../types/message.js'

export async function writeSessionTranscriptSegment(
  _messages: Message[],
): Promise<void> {
  // Write a segment of the session transcript to disk
}

export function flushOnDateChange(
  _messages: Message[],
  _currentDate: Date,
): void {
  // Flush transcript segment when the date changes (long-running sessions)
}
