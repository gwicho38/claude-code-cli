// Stub for internal @anthropic-ai/sandbox-runtime package
import { z } from 'zod'

export type FsReadRestrictionConfig = any
export type FsWriteRestrictionConfig = any
export type IgnoreViolationsConfig = any
export type NetworkHostPattern = any
export type NetworkRestrictionConfig = any
export type SandboxAskCallback = any
export type SandboxDependencyCheck = { errors: any[]; warnings: any[] }
export type SandboxRuntimeConfig = any
export type SandboxViolationEvent = any

export const SandboxRuntimeConfigSchema = z.object({}).passthrough()

export class SandboxManager {
  constructor(..._args: any[]) {}
  static checkDependencies(..._args: any[]): SandboxDependencyCheck { return { errors: [], warnings: [] } }
  static isSupportedPlatform(): boolean { return false }
  static initialize(..._args: any[]): Promise<void> { return Promise.resolve() }
  static updateConfig(..._args: any[]): void {}
  static reset(): void {}
  static wrapWithSandbox(..._args: any[]): any { return _args[0] }
  static getFsReadConfig(): any { return {} }
  static getFsWriteConfig(): any { return {} }
  static getNetworkRestrictionConfig(): any { return {} }
  static getIgnoreViolations(): any { return {} }
  static getAllowUnixSockets(): boolean { return false }
  static getAllowLocalBinding(): boolean { return false }
  static getEnableWeakerNestedSandbox(): boolean { return false }
  static getProxyPort(): number | undefined { return undefined }
  static getSocksProxyPort(): number | undefined { return undefined }
}

export class SandboxViolationStore {
  constructor(..._args: any[]) {}
}
