/**
 * Memory shape telemetry — logs memory recall and write patterns.
 * Feature-gated: MEMORY_SHAPE_TELEMETRY
 */

export function logMemoryRecallShape(
  _memories: unknown[],
  _selected: unknown[],
): void {}

export function logMemoryWriteShape(
  _toolName: string,
  _toolInput: unknown,
  _filePath: string,
  _scope: string,
): void {}
