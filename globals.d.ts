/**
 * Build-time macros injected via bun build --define.
 * At bundle time, references like MACRO.VERSION are replaced with literal values.
 */
declare const MACRO: {
  /** Semver version string, e.g. "1.0.34" */
  VERSION: string
  /** ISO 8601 build timestamp */
  BUILD_TIME: string
  /** npm package URL, e.g. "@anthropic-ai/claude-code" */
  PACKAGE_URL: string
  /** Native binary package URL */
  NATIVE_PACKAGE_URL: string
  /** Feedback channel reference (e.g. Slack channel or URL) */
  FEEDBACK_CHANNEL: string
  /** Instructions for reporting issues */
  ISSUES_EXPLAINER: string
  /** Changelog content for the current version */
  VERSION_CHANGELOG: string
}

/**
 * bun:bundle is a virtual module available only during Bun's bundler phase.
 * feature(name) returns true if the named condition was passed to the build,
 * enabling dead-code elimination of gated branches.
 */
declare module 'bun:bundle' {
  export function feature(name: string): boolean
}
