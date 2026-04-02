/**
 * MCP UI component types.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/config.rs (McpServerConfig variants)
 */

export interface StdioServerInfo {
  transport: 'stdio'
  command: string
  args: string[]
  env: Record<string, string>
}

export interface SSEServerInfo {
  transport: 'sse'
  url: string
  headers: Record<string, string>
}

export interface HTTPServerInfo {
  transport: 'http'
  url: string
  headers: Record<string, string>
}

export interface ClaudeAIServerInfo {
  transport: 'claude_ai'
  url: string
  id: string
}
