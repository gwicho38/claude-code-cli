/**
 * Assistant mode gate — entitlement check for assistant/Kairos mode.
 * Feature-gated: KAIROS
 */

export async function isKairosEnabled(): Promise<boolean> {
  return false
}

export function isAssistantForced(): boolean {
  return false
}

export function markAssistantForced(): void {}

export function isAssistantMode(): boolean {
  return false
}
