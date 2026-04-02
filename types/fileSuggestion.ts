/**
 * File suggestion types for hook-based file path completion.
 *
 * The file suggestion system allows hooks (configured in settings.json)
 * to provide custom file path completions as the user types. The CLI
 * sends a FileSuggestionCommandInput to the hook process via stdin,
 * and the hook returns suggested file paths.
 *
 * Extends the SDK's BaseHookInput schema from entrypoints/sdk/coreSchemas.ts.
 */

/**
 * Input sent to file suggestion hook commands.
 *
 * Extends BaseHookInput (session_id, transcript_path, cwd, permission_mode,
 * agent_id, agent_type) with the partial file path query.
 *
 * Constructed in hooks/fileSuggestions.ts via:
 *   { ...createBaseHookInput(), query: partialPath }
 */
export interface FileSuggestionCommandInput {
  /** Current session identifier */
  session_id: string
  /** Path to the session transcript file */
  transcript_path: string
  /** Current working directory */
  cwd: string
  /** Active permission mode */
  permission_mode?: string
  /** Subagent identifier (if running in a subagent) */
  agent_id?: string
  /** Agent type name */
  agent_type?: string
  /** The partial file path the user has typed so far */
  query: string
}
