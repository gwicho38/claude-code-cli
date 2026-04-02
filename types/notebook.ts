/**
 * Jupyter Notebook (.ipynb) types for the Claude Code CLI.
 *
 * Follows the nbformat v4.5 specification:
 *   - Schema: https://github.com/jupyter/nbformat/blob/main/nbformat/v4/nbformat.v4.5.schema.json
 *   - Docs: https://nbformat.readthedocs.io/en/latest/format_description.html
 *
 * These types model the on-disk .ipynb JSON format, plus internal
 * representations used by NotebookEditTool for diffs and rendering.
 */

// ============================================================================
// Cell Types
// ============================================================================

export type NotebookCellType = 'code' | 'markdown' | 'raw'

/**
 * A single cell in a Jupyter notebook (on-disk format).
 * Maps directly to the nbformat v4.5 cell schema.
 */
export interface NotebookCell {
  /** Cell type: code, markdown, or raw */
  cell_type: NotebookCellType
  /** Unique cell identifier (nbformat >= 4.5) */
  id?: string
  /** Cell source — a string or array of strings (one per line) */
  source: string | string[]
  /** Cell-level metadata */
  metadata: Record<string, unknown>
  /** Execution count (code cells only, null if not executed) */
  execution_count?: number | null
  /** Cell outputs (code cells only) */
  outputs?: NotebookCellOutput[]
}

// ============================================================================
// Cell Outputs — on-disk format
// ============================================================================

export type NotebookCellOutput =
  | NotebookStreamOutput
  | NotebookExecuteResultOutput
  | NotebookDisplayDataOutput
  | NotebookErrorOutput

export interface NotebookStreamOutput {
  output_type: 'stream'
  /** Stream name: stdout or stderr */
  name: string
  /** Output text — string or array of strings */
  text: string | string[]
}

export interface NotebookExecuteResultOutput {
  output_type: 'execute_result'
  execution_count: number | null
  /** MIME-keyed output data (e.g. "text/plain", "image/png") */
  data: Record<string, unknown>
  metadata: Record<string, unknown>
}

export interface NotebookDisplayDataOutput {
  output_type: 'display_data'
  /** MIME-keyed output data */
  data: Record<string, unknown>
  metadata: Record<string, unknown>
}

export interface NotebookErrorOutput {
  output_type: 'error'
  /** Error class name */
  ename: string
  /** Error message */
  evalue: string
  /** Traceback lines */
  traceback: string[]
}

// ============================================================================
// Notebook Document — top-level on-disk format
// ============================================================================

/**
 * A complete Jupyter notebook document (.ipynb JSON).
 */
export interface NotebookContent {
  /** Array of cells */
  cells: NotebookCell[]
  /** Notebook-level metadata (kernelspec, language_info, etc.) */
  metadata: {
    kernelspec?: {
      display_name: string
      language: string
      name: string
    }
    language_info?: {
      name: string
      version?: string
      file_extension?: string
      mimetype?: string
    }
    [key: string]: unknown
  }
  /** Major version of the notebook format (always 4) */
  nbformat: number
  /** Minor version of the notebook format */
  nbformat_minor: number
}

// ============================================================================
// Internal representations — used by NotebookEditTool and diff rendering
// ============================================================================

/**
 * Processed cell source for tool result rendering.
 * Created by processCell() in utils/notebook.ts.
 */
export interface NotebookCellSource {
  cellType: NotebookCellType
  source: string
  language?: string
  execution_count?: number
  cell_id: string
  outputs?: NotebookCellSourceOutput[]
}

/**
 * Processed cell output with extracted text and images.
 */
export interface NotebookCellSourceOutput {
  output_type: string
  text?: string
  image?: NotebookOutputImage
}

/**
 * An extracted image from a cell output's MIME data.
 */
export interface NotebookOutputImage {
  /** Base64-encoded image data */
  image_data: string
  /** MIME type */
  media_type: 'image/png' | 'image/jpeg'
}
