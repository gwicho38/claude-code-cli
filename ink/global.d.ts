// Ink global type declarations
// Augments JSX.IntrinsicElements for Ink's custom elements

import type { Styles } from './styles.js'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ink-box': any
      'ink-text': any
      'ink-root': any
      'ink-virtual-text': any
    }
  }
}
