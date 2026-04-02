/**
 * SSH session manager — manages lifecycle of SSH remote sessions.
 * Feature-gated: SSH_REMOTE
 */

export class SSHSessionManager {
  async connect(_host: string, _options?: unknown): Promise<void> {}
  async disconnect(): Promise<void> {}
  isConnected(): boolean { return false }
}
