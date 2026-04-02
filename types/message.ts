/**
 * Core message types for the Claude Code CLI.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/api/src/types.rs (API wire types)
 *   - Rust: claw-code/rust/crates/runtime/src/session.rs (storage types)
 *   - Python: claw-code/src/query_engine.py (TurnResult, QueryEngineConfig)
 */

// ============================================================================
// Message Roles
// ============================================================================

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool'

// ============================================================================
// Content Blocks — API wire format (input to API)
// ============================================================================

export type InputContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | {
      type: 'tool_result'
      tool_use_id: string
      content: ToolResultContentBlock[]
      is_error?: boolean
    }

export type ToolResultContentBlock =
  | { type: 'text'; text: string }
  | { type: 'json'; value: unknown }

export type InputMessage = {
  role: string
  content: InputContentBlock[]
}

// ============================================================================
// Content Blocks — API wire format (output from API)
// ============================================================================

export type OutputContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | { type: 'thinking'; thinking: string; signature?: string }
  | { type: 'redacted_thinking'; data: unknown }

// ============================================================================
// Content Blocks — Internal storage format
// ============================================================================

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: string }
  | {
      type: 'tool_result'
      tool_use_id: string
      tool_name: string
      output: string
      is_error: boolean
    }

// ============================================================================
// API Request / Response
// ============================================================================

export interface Usage {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens: number
  cache_read_input_tokens: number
}

export interface ToolDefinition {
  name: string
  description?: string
  input_schema: Record<string, unknown>
}

export type ToolChoice =
  | { type: 'auto' }
  | { type: 'any' }
  | { type: 'tool'; name: string }

export interface MessageRequest {
  model: string
  max_tokens: number
  messages: InputMessage[]
  system?: string
  tools?: ToolDefinition[]
  tool_choice?: ToolChoice
  stream?: boolean
}

export interface MessageResponse {
  id: string
  type: string
  role: string
  content: OutputContentBlock[]
  model: string
  stop_reason?: string
  stop_sequence?: string
  usage: Usage
  request_id?: string
}

// ============================================================================
// Conversation & Session Messages
// ============================================================================

export interface ConversationMessage {
  role: MessageRole
  blocks: ContentBlock[]
  usage?: TokenUsage
}

export interface TokenUsage {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens: number
  cache_read_input_tokens: number
}

export interface Session {
  version: number
  messages: ConversationMessage[]
}

// ============================================================================
// Streaming Events
// ============================================================================

export interface MessageStartEvent {
  type: 'message_start'
  message: MessageResponse
}

export interface MessageDeltaEvent {
  type: 'message_delta'
  delta: {
    stop_reason?: string
    stop_sequence?: string
  }
  usage: Usage
}

export interface ContentBlockStartEvent {
  type: 'content_block_start'
  index: number
  content_block: OutputContentBlock
}

export interface ContentBlockDeltaEvent {
  type: 'content_block_delta'
  index: number
  delta: ContentBlockDelta
}

export type ContentBlockDelta =
  | { type: 'text_delta'; text: string }
  | { type: 'input_json_delta'; partial_json: string }
  | { type: 'thinking_delta'; thinking: string }
  | { type: 'signature_delta'; signature: string }

export interface ContentBlockStopEvent {
  type: 'content_block_stop'
  index: number
}

export interface MessageStopEvent {
  type: 'message_stop'
}

export type StreamEvent =
  | MessageStartEvent
  | MessageDeltaEvent
  | ContentBlockStartEvent
  | ContentBlockDeltaEvent
  | ContentBlockStopEvent
  | MessageStopEvent

// ============================================================================
// Normalized message types used throughout the CLI
// ============================================================================

/** A user message after normalization (prompt processing, stdin merging, etc.) */
export interface NormalizedUserMessage {
  role: 'user'
  content: InputContentBlock[]
}

/** Union of all message types flowing through the system */
export type Message = ConversationMessage
