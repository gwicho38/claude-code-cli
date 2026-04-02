/**
 * Job classifier — classifies prompts/actions for routing.
 *
 * Translated from:
 *   - Python: claw-code/src/runtime.py (PortRuntime.route_prompt, _score)
 */

export interface ClassifierResult {
  kind: 'command' | 'tool' | 'query'
  name: string
  score: number
  source: string
}

export function classifyPrompt(_prompt: string): ClassifierResult[] {
  return []
}

export function classifyToolInput(
  _toolName: string,
  _input: string,
): ClassifierResult | null {
  return null
}
