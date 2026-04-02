/**
 * Bun preload script that provides build-time constructs at runtime.
 * Usage: bun --preload=./preload.ts ./entrypoints/cli.tsx
 *
 * This replaces:
 *  - bun:bundle's feature() function with a runtime implementation
 *  - MACRO.* build-time constants with runtime values
 *  - Internal package resolution with stubs
 */

import { readFileSync } from 'fs'
import { resolve, join } from 'path'

// --- Feature flags ---
const DISABLED_FEATURES = new Set([
  'CHICAGO_MCP',
  'SELF_HOSTED_RUNNER',
  'BYOC_ENVIRONMENT_RUNNER',
  'ABLATION_BASELINE',
  'CCR_REMOTE_SETUP',
  'CCR_AUTO_CONNECT',
  'CCR_MIRROR',
  'NATIVE_CLIENT_ATTESTATION',
  'KAIROS',
  'KAIROS_BRIEF',
  'KAIROS_CHANNELS',
  'KAIROS_DREAM',
  'KAIROS_GITHUB_WEBHOOKS',
  'KAIROS_PUSH_NOTIFICATION',
  'CONNECTOR_TEXT',
  'CACHED_MICROCOMPACT',
  'VERIFICATION_AGENT',
  'MONITOR_TOOL',
  'WORKFLOW_SCRIPTS',
  'AGENT_MEMORY_SNAPSHOT',
  'PROACTIVE',
  'HISTORY_SNIP',
])

const projectRoot = resolve(import.meta.dir)
const stubsDir = join(projectRoot, 'stubs')

// Internal packages to stub: package name → { subpath: file in stubs/ }
const INTERNAL_PACKAGES: Record<string, Record<string, string>> = {
  '@ant/claude-for-chrome-mcp': { '.': 'index.ts' },
  '@ant/computer-use-input': { '.': 'index.ts' },
  '@ant/computer-use-mcp': { '.': 'index.ts', 'types': 'types.ts', 'sentinelApps': 'sentinelApps.ts' },
  '@ant/computer-use-swift': { '.': 'index.ts' },
  '@anthropic-ai/mcpb': { '.': 'index.ts' },
  '@anthropic-ai/sandbox-runtime': { '.': 'index.ts' },
  'color-diff-napi': { '.': 'index.ts' },
}

function readStub(pkg: string, file: string): string {
  return readFileSync(join(stubsDir, pkg, file), 'utf-8')
}

Bun.plugin({
  name: 'claude-code-dev',
  setup(build) {
    // Shim bun:bundle with runtime feature() implementation
    build.module('bun:bundle', () => ({
      exports: {
        feature(name: string): boolean {
          return !DISABLED_FEATURES.has(name)
        },
      },
      loader: 'object',
    }))

    // Bridge react/compiler-runtime → react-compiler-runtime package
    build.module('react/compiler-runtime', () => {
      const runtime = require('react-compiler-runtime')
      return { exports: runtime, loader: 'object' }
    })

    // Register internal packages as virtual modules with stub contents
    for (const [pkg, subpaths] of Object.entries(INTERNAL_PACKAGES)) {
      for (const [subpath, file] of Object.entries(subpaths)) {
        const moduleName = subpath === '.' ? pkg : `${pkg}/${subpath}`
        const contents = readStub(pkg, file)
        build.module(moduleName, () => ({
          contents,
          loader: 'ts',
        }))
      }
    }
  },
})

// --- MACRO globals ---
const VERSION = process.env.CLAUDE_CODE_VERSION ?? '1.0.34'

;(globalThis as any).MACRO = {
  VERSION,
  BUILD_TIME: new Date().toISOString(),
  PACKAGE_URL: '@anthropic-ai/claude-code',
  NATIVE_PACKAGE_URL: '@anthropic-ai/claude-code-native',
  FEEDBACK_CHANNEL: 'https://github.com/anthropics/claude-code/issues',
  ISSUES_EXPLAINER: 'Report issues at https://github.com/anthropics/claude-code/issues',
  VERSION_CHANGELOG: '',
}
