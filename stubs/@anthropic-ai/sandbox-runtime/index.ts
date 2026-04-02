// Stub for internal @anthropic-ai/sandbox-runtime package
import { z } from 'zod'

export type FsReadRestrictionConfig = any
export type FsWriteRestrictionConfig = any
export type IgnoreViolationsConfig = any
export type NetworkHostPattern = any
export type NetworkRestrictionConfig = any
export type SandboxAskCallback = any
export type SandboxDependencyCheck = any
export type SandboxRuntimeConfig = any
export type SandboxViolationEvent = any

export const SandboxRuntimeConfigSchema = z.object({}).passthrough()

export class SandboxManager {
  constructor(..._args: any[]) {}
}

export class SandboxViolationStore {
  constructor(..._args: any[]) {}
}
