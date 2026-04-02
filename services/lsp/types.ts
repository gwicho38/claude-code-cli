/**
 * LSP (Language Server Protocol) types for Claude Code CLI.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/lsp/src/types.rs
 */

import type { Diagnostic, Range } from 'vscode-languageserver-types'

export interface LspServerConfig {
  name: string
  command: string
  args: string[]
  env: Record<string, string>
  workspace_root: string
  initialization_options?: unknown
  extension_to_language: Record<string, string>
}

export interface FileDiagnostics {
  path: string
  uri: string
  diagnostics: Diagnostic[]
}

export interface WorkspaceDiagnostics {
  files: FileDiagnostics[]
}

export interface SymbolLocation {
  path: string
  range: Range
}

export interface LspContextEnrichment {
  file_path: string
  diagnostics: WorkspaceDiagnostics
  definitions: SymbolLocation[]
  references: SymbolLocation[]
}

export function isWorkspaceDiagnosticsEmpty(wd: WorkspaceDiagnostics): boolean {
  return wd.files.length === 0
}

export function totalDiagnostics(wd: WorkspaceDiagnostics): number {
  return wd.files.reduce((sum, file) => sum + file.diagnostics.length, 0)
}

export function isLspContextEmpty(ctx: LspContextEnrichment): boolean {
  return (
    isWorkspaceDiagnosticsEmpty(ctx.diagnostics) &&
    ctx.definitions.length === 0 &&
    ctx.references.length === 0
  )
}

export function symbolLocationToString(loc: SymbolLocation): string {
  return `${loc.path}:${loc.range.start.line + 1}:${loc.range.start.character + 1}`
}
