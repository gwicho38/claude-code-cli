/**
 * Cached microcompact configuration.
 * Feature-gated: CACHED_MICROCOMPACT
 */

export interface CachedMCConfig {
  enabled: boolean
  maxCacheSize: number
}

export function getCachedMCConfig(): CachedMCConfig {
  return { enabled: false, maxCacheSize: 0 }
}
