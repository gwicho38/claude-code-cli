/**
 * Context collapse — intelligently collapses tool results to reduce context usage.
 *
 * Translated from:
 *   - Python: claw-code/src/transcript.py (TranscriptStore.compact)
 *   - Python: claw-code/src/query_engine.py (compact_messages_if_needed)
 */

interface ContextCollapseStats {
  collapsedCount: number
  savedTokens: number
  enabled: boolean
}

let enabled = false
const stats: ContextCollapseStats = {
  collapsedCount: 0,
  savedTokens: 0,
  enabled: false,
}

type Subscriber = () => void
const subscribers: Subscriber[] = []

export function initContextCollapse(): void {
  enabled = true
  stats.enabled = true
}

export function resetContextCollapse(): void {
  enabled = false
  stats.collapsedCount = 0
  stats.savedTokens = 0
  stats.enabled = false
}

export function isContextCollapseEnabled(): boolean {
  return enabled
}

export function getStats(): ContextCollapseStats {
  return { ...stats }
}

export function subscribe(fn: Subscriber): () => void {
  subscribers.push(fn)
  return () => {
    const idx = subscribers.indexOf(fn)
    if (idx >= 0) subscribers.splice(idx, 1)
  }
}
