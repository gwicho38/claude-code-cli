/**
 * Status line types for hook-based status line customization.
 *
 * The status line system allows hooks (configured in settings.json)
 * to render a custom status line at the bottom of the terminal. The CLI
 * sends a StatusLineCommandInput to the hook process via stdin, and the
 * hook returns formatted status text.
 *
 * Extends the SDK's BaseHookInput schema from entrypoints/sdk/coreSchemas.ts.
 */

/**
 * Input sent to status line hook commands.
 *
 * Extends BaseHookInput with session context needed to render an
 * informative status bar — model, usage, permissions, context window, etc.
 *
 * Constructed in components/StatusLine.tsx via buildStatusLineCommandInput().
 */
export interface StatusLineCommandInput {
  /** Current session identifier */
  session_id: string
  /** Path to the session transcript file */
  transcript_path: string
  /** Current working directory */
  cwd: string
  /** Active permission mode name */
  permission_mode?: string
  /** Subagent identifier (if running in a subagent) */
  agent_id?: string
  /** Agent type name */
  agent_type?: string

  // --- Session context fields ---

  /** Current session display name */
  session_name?: string
  /** Active model identifier (e.g. "claude-sonnet-4-6") */
  model: string
  /** Whether the context exceeds 200k tokens */
  exceeds_200k_tokens: boolean
  /** Additional directories added via --add-dir */
  added_dirs: string[]
  /** Active output style name */
  output_style: string
  /** Active vim mode (if enabled) */
  vim_mode?: string
  /** Active agent type (if --agent was specified) */
  active_agent_type?: string
  /** Current worktree session path (if in a worktree) */
  worktree_session?: string

  // --- Usage & context window ---

  /** Total input tokens used so far */
  input_tokens: number
  /** Total output tokens used so far */
  output_tokens: number
  /** Total cache read tokens */
  cache_read_tokens: number
  /** Total cache creation tokens */
  cache_creation_tokens: number
  /** Context window size for the active model */
  context_window_size: number
  /** Percentage of context window used */
  context_used_percent: number
}
