/**
 * Skill discovery signal types.
 *
 * Translated from:
 *   - Python: claw-code/src/runtime.py (RoutedMatch — skill routing signals)
 */

export interface DiscoverySignal {
  kind: 'local' | 'remote' | 'plugin'
  name: string
  source: string
  score: number
}
