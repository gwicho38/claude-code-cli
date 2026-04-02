/**
 * Keybinding types for keyboard shortcut management.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/config.rs (RuntimeFeatureConfig)
 */

export type KeybindingContextName =
  | 'global'
  | 'prompt'
  | 'permission'
  | 'dialog'
  | 'vim-normal'
  | 'vim-insert'

export type KeybindingAction =
  | 'submit'
  | 'cancel'
  | 'accept'
  | 'reject'
  | 'escape'
  | 'tab'
  | 'up'
  | 'down'
  | 'interrupt'
  | 'exit'
  | 'help'
  | 'compact'
  | 'toggleVim'
  | 'toggleTheme'
  | 'toggleFastMode'
  | 'switchModel'
  | 'expandOutput'
  | 'planMode'

export interface ParsedKeystroke {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  sequence: string
}
