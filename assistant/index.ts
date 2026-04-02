/**
 * Assistant module entry point.
 * Feature-gated: KAIROS
 */

export { isKairosEnabled, isAssistantForced, markAssistantForced, isAssistantMode } from './gate.js'

export async function initializeAssistantTeam(): Promise<undefined> {
  return undefined
}

export default null
