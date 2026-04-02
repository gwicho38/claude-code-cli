/**
 * Skill discovery prefetch — pre-fetches skill metadata for turn-zero display.
 *
 * Translated from:
 *   - Python: claw-code/src/prefetch.py (PrefetchResult)
 */

import type { DiscoverySignal } from './signals.js'

export async function getTurnZeroSkillDiscovery(): Promise<DiscoverySignal[]> {
  return []
}

export async function collectSkillDiscoveryPrefetch(): Promise<DiscoverySignal[]> {
  return []
}
