/**
 * Paste event handling for the Ink terminal framework.
 */

export interface PasteEvent {
  type: 'paste'
  data: string
}

export function createPasteEvent(data: string): PasteEvent {
  return { type: 'paste', data }
}
