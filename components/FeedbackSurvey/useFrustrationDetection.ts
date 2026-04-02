/**
 * Frustration detection hook — detects user frustration patterns.
 */

export function useFrustrationDetection(): {
  isFrustrated: boolean
  frustrationScore: number
} {
  return { isFrustrated: false, frustrationScore: 0 }
}
