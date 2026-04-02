/**
 * Resize event handling for the Ink terminal framework.
 */

export interface ResizeEvent {
  type: 'resize'
  columns: number
  rows: number
}

export function createResizeEvent(columns: number, rows: number): ResizeEvent {
  return { type: 'resize', columns, rows }
}
