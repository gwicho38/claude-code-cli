/**
 * Tip types — contextual tips shown to users.
 */

export interface Tip {
  id: string
  content: string
  category: string
  priority: number
  shown: boolean
}

export interface TipSchedule {
  tipId: string
  showAfterTurns: number
  showOnce: boolean
}
