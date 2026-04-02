/**
 * Base transport interface for CLI remote connections.
 * Implemented by SSETransport and WebSocketTransport.
 */

export interface Transport {
  isConnectedStatus(): boolean
  isClosedStatus(): boolean
  setOnData(callback: (data: string) => void): void
  setOnClose(callback: (closeCode?: number) => void): void
  setOnEvent(callback: (event: unknown) => void): void
  close(): void
  connect(): Promise<void>
  send(data: unknown): void | Promise<void>
}
