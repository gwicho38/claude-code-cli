/**
 * Unix domain socket client for inter-process communication.
 * Feature-gated: UDS_INBOX
 */

export class UdsClient {
  constructor(_socketPath: string) {}
  async connect(): Promise<void> {}
  async send(_data: unknown): Promise<void> {}
  async close(): Promise<void> {}
}
