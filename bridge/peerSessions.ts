/**
 * Peer session management for remote bridge connections.
 * Feature-gated: BRIDGE_MODE
 */

export function getPeerSessions(): Map<string, unknown> {
  return new Map()
}

export function registerPeerSession(_id: string, _session: unknown): void {}

export function removePeerSession(_id: string): void {}
