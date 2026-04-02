/**
 * UDS messaging layer — higher-level messaging over Unix domain sockets.
 * Feature-gated: UDS_INBOX
 */

export async function startUdsMessaging(
  _socketPath: string,
  _onMessage: (message: unknown) => void,
): Promise<void> {}

export async function stopUdsMessaging(): Promise<void> {}
