// Stub: SDK runtime types (non-serializable callbacks and interfaces)
// These are generated/internal types not included in the public source dump.

import type { z } from 'zod/v4'

export type AnyZodRawShape = Record<string, z.ZodType<any>>
export type InferShape<T extends AnyZodRawShape> = { [K in keyof T]: z.infer<T[K]> }

export type Options = Record<string, any>
export type Query = Record<string, any>
export type InternalOptions = Options & { _internal?: boolean }
export type InternalQuery = Query & { _internal?: boolean }

export type SDKSession = {
  id: string
  send: (message: any) => Promise<any>
  close: () => Promise<void>
}

export type SDKSessionOptions = {
  model?: string
  maxTokens?: number
}

export type SessionMessage = {
  role: string
  content: any
}

export type SessionMutationOptions = {
  sessionId?: string
}

export type ListSessionsOptions = {
  limit?: number
}

export type GetSessionInfoOptions = {
  sessionId: string
}

export type GetSessionMessagesOptions = {
  sessionId: string
  limit?: number
}

export type ForkSessionOptions = {
  sessionId: string
  messageIndex?: number
}

export type ForkSessionResult = {
  sessionId: string
}

export type McpSdkServerConfigWithInstance = {
  name: string
  config: any
  instance?: any
}

export type SdkMcpToolDefinition = {
  name: string
  description?: string
  inputSchema?: any
}
