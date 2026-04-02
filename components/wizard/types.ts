/**
 * Wizard framework types — generic multi-step wizard components.
 * Used by WizardProvider, useWizard, and agent creation wizard.
 */

import type React from 'react'

export type WizardStepComponent<T> = React.FC<{
  wizardData: T
  updateWizardData: (data: Partial<T>) => void
  goBack: () => void
  goNext: () => void
  goToStep: (index: number) => void
  currentStepIndex: number
}>

export interface WizardContextValue<T> {
  wizardData: T
  updateWizardData: (data: Partial<T>) => void
  goBack: () => void
  goNext: () => void
  goToStep: (index: number) => void
  currentStepIndex: number
  totalSteps: number
}

export interface WizardProviderProps<T> {
  steps: WizardStepComponent<T>[]
  initialData?: T
  onComplete: (data: T) => void
  onCancel: () => void
  title?: string
  showStepCounter?: boolean
  children?: React.ReactNode
}
