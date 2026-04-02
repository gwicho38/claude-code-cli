/**
 * SSH session factory — creates and configures SSH sessions.
 * Feature-gated: SSH_REMOTE
 */

import { SSHSessionManager } from './SSHSessionManager.js'

export async function createSSHSession(
  _host: string,
  _cwd?: string,
  _options?: unknown,
): Promise<SSHSessionManager> {
  return new SSHSessionManager()
}
