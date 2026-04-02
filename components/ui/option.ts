/**
 * Option type for select/list components.
 */

import type React from 'react'

export interface Option {
  value: string
  label: React.ReactNode
  description?: string
  disabled?: boolean
}
