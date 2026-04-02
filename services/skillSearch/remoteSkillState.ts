/**
 * Remote skill state — tracks discovered remote skills during a session.
 */

export function getDiscoveredRemoteSkill(
  _name: string,
): { content: string; metadata: Record<string, unknown> } | undefined {
  return undefined
}

export function stripCanonicalPrefix(name: string): string {
  return name.replace(/^[^:]+:/, '')
}
