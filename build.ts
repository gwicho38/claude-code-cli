/**
 * Build script for Claude Code CLI from source.
 *
 * Usage:
 *   bun run build.ts              # production build
 *   bun run build.ts --dev        # dev build (no minification)
 *   bun run build.ts --compile    # compile to standalone binary
 */

import { resolve, join, dirname } from 'path'
import { existsSync } from 'fs'

const isDev = process.argv.includes('--dev')
const shouldCompile = process.argv.includes('--compile')

const VERSION = process.env.CLAUDE_CODE_VERSION ?? '0.0.0-dev'
const BUILD_TIME = new Date().toISOString()

// Feature flags to DISABLE (these require internal packages or missing source files).
const DISABLED_FEATURES = new Set([
  'CHICAGO_MCP',              // requires @ant/computer-use-* internal packages
  'SELF_HOSTED_RUNNER',       // internal infrastructure
  'BYOC_ENVIRONMENT_RUNNER',  // internal infrastructure
  'ABLATION_BASELINE',        // internal testing only
  'CCR_REMOTE_SETUP',         // internal remote infra
  'CCR_AUTO_CONNECT',         // internal remote infra
  'CCR_MIRROR',               // internal remote infra
  'NATIVE_CLIENT_ATTESTATION', // requires native binary attestation
  'KAIROS',                   // requires missing assistant/ source files
  'KAIROS_BRIEF',             // requires missing assistant/ source files
  'KAIROS_CHANNELS',          // requires missing assistant/ source files
  'KAIROS_DREAM',             // requires missing assistant/ source files
  'KAIROS_GITHUB_WEBHOOKS',   // requires missing assistant/ source files
  'KAIROS_PUSH_NOTIFICATION', // requires missing assistant/ source files
  'CONNECTOR_TEXT',           // requires missing types/connectorText.ts
  'CACHED_MICROCOMPACT',      // requires missing cachedMicrocompact.ts
  'VERIFICATION_AGENT',       // requires missing VerifyPlanExecutionTool
  'MONITOR_TOOL',             // requires missing TungstenTool
  'WORKFLOW_SCRIPTS',         // requires missing WorkflowTool
  'AGENT_MEMORY_SNAPSHOT',    // requires missing SnapshotUpdateDialog
  'PROACTIVE',                // requires missing commands/proactive.ts
  'HISTORY_SNIP',             // requires missing snipCompact.ts
])

// All known feature flags from the codebase
const ALL_FEATURES = [
  'ABLATION_BASELINE', 'AGENT_MEMORY_SNAPSHOT', 'AGENT_TRIGGERS', 'AGENT_TRIGGERS_REMOTE',
  'ALLOW_TEST_VERSIONS', 'ANTI_DISTILLATION_CC', 'AUTO_THEME', 'AWAY_SUMMARY',
  'BASH_CLASSIFIER', 'BG_SESSIONS', 'BREAK_CACHE_COMMAND', 'BRIDGE_MODE', 'BUDDY',
  'BUILDING_CLAUDE_APPS', 'BUILTIN_EXPLORE_PLAN_AGENTS', 'BYOC_ENVIRONMENT_RUNNER',
  'CACHED_MICROCOMPACT', 'CCR_AUTO_CONNECT', 'CCR_MIRROR', 'CCR_REMOTE_SETUP',
  'CHICAGO_MCP', 'COMMIT_ATTRIBUTION', 'COMPACTION_REMINDERS', 'CONNECTOR_TEXT',
  'CONTEXT_COLLAPSE', 'COORDINATOR_MODE', 'COWORKER_TYPE_TELEMETRY', 'DAEMON',
  'DIRECT_CONNECT', 'DOWNLOAD_USER_SETTINGS', 'DUMP_SYSTEM_PROMPT',
  'ENHANCED_TELEMETRY_BETA', 'EXPERIMENTAL_SKILL_SEARCH', 'EXTRACT_MEMORIES',
  'FILE_PERSISTENCE', 'FORK_SUBAGENT', 'HARD_FAIL', 'HISTORY_PICKER', 'HISTORY_SNIP',
  'HOOK_PROMPTS', 'IS_LIBC_GLIBC', 'IS_LIBC_MUSL', 'KAIROS', 'KAIROS_BRIEF',
  'KAIROS_CHANNELS', 'KAIROS_DREAM', 'KAIROS_GITHUB_WEBHOOKS', 'KAIROS_PUSH_NOTIFICATION',
  'LODESTONE', 'MCP_RICH_OUTPUT', 'MCP_SKILLS', 'MEMORY_SHAPE_TELEMETRY',
  'MESSAGE_ACTIONS', 'MONITOR_TOOL', 'NATIVE_CLIENT_ATTESTATION', 'NATIVE_CLIPBOARD_IMAGE',
  'NEW_INIT', 'OVERFLOW_TEST_TOOL', 'PERFETTO_TRACING', 'POWERSHELL_AUTO_MODE',
  'PROACTIVE', 'PROMPT_CACHE_BREAK_DETECTION', 'QUICK_SEARCH', 'REACTIVE_COMPACT',
  'REVIEW_ARTIFACT', 'RUN_SKILL_GENERATOR', 'SELF_HOSTED_RUNNER', 'SHOT_STATS',
  'SKILL_IMPROVEMENT', 'SLOW_OPERATION_LOGGING', 'SSH_REMOTE', 'STREAMLINED_OUTPUT',
  'TEAMMEM', 'TEMPLATES', 'TERMINAL_PANEL', 'TOKEN_BUDGET', 'TORCH',
  'TRANSCRIPT_CLASSIFIER', 'TREE_SITTER_BASH', 'TREE_SITTER_BASH_SHADOW', 'UDS_INBOX',
  'ULTRAPLAN', 'ULTRATHINK', 'UNATTENDED_RETRY', 'UPLOAD_USER_SETTINGS',
  'VERIFICATION_AGENT', 'VOICE_MODE', 'WEB_BROWSER_TOOL', 'WORKFLOW_SCRIPTS',
]

// Build a feature lookup map: feature('X') => true/false
const featureMap: Record<string, boolean> = {}
for (const f of ALL_FEATURES) {
  featureMap[f] = !DISABLED_FEATURES.has(f)
}

const enabledCount = ALL_FEATURES.filter(f => featureMap[f]).length

console.log(`Building Claude Code CLI v${VERSION}`)
console.log(`  Mode: ${isDev ? 'development' : 'production'}`)
console.log(`  Features enabled: ${enabledCount}/${ALL_FEATURES.length}`)
console.log(`  Features disabled: ${[...DISABLED_FEATURES].join(', ')}`)
console.log()

const define: Record<string, string> = {
  'MACRO.VERSION': JSON.stringify(VERSION),
  'MACRO.BUILD_TIME': JSON.stringify(BUILD_TIME),
  'MACRO.PACKAGE_URL': JSON.stringify('@anthropic-ai/claude-code'),
  'MACRO.NATIVE_PACKAGE_URL': JSON.stringify('@anthropic-ai/claude-code-native'),
  'MACRO.FEEDBACK_CHANNEL': JSON.stringify('https://github.com/anthropics/claude-code/issues'),
  'MACRO.ISSUES_EXPLAINER': JSON.stringify(
    'Report issues at https://github.com/anthropics/claude-code/issues'
  ),
  'MACRO.VERSION_CHANGELOG': JSON.stringify(''),
}

// Generate the bun:bundle shim module source.
const bunBundleShimSource = `
export function feature(name) {
  const flags = ${JSON.stringify(featureMap)};
  return flags[name] ?? false;
}
`

const projectRoot = resolve(import.meta.dir)
const stubsDir = resolve(projectRoot, 'stubs')

async function build() {
  const result = await Bun.build({
    entrypoints: ['./entrypoints/cli.tsx'],
    outdir: './dist',
    target: 'bun',
    format: 'esm',
    splitting: false,
    sourcemap: isDev ? 'inline' : 'linked',
    minify: !isDev,
    define,
    external: [
      // Node built-ins that Bun resolves at runtime
      'node:*',
      // Native modules that can't be bundled
      'fsevents',
      // Optional SDK packages (dynamically imported, not needed for core CLI)
      '@anthropic-ai/bedrock-sdk',
      '@anthropic-ai/foundry-sdk',
      '@anthropic-ai/vertex-sdk',
      '@azure/identity',
      '@aws-sdk/client-sts',
      '@aws-sdk/client-bedrock',
      // OpenTelemetry exporters (lazily imported)
      '@opentelemetry/exporter-logs-otlp-grpc',
      '@opentelemetry/exporter-logs-otlp-http',
      '@opentelemetry/exporter-logs-otlp-proto',
      '@opentelemetry/exporter-metrics-otlp-grpc',
      '@opentelemetry/exporter-metrics-otlp-http',
      '@opentelemetry/exporter-metrics-otlp-proto',
      '@opentelemetry/exporter-prometheus',
      '@opentelemetry/exporter-trace-otlp-grpc',
      '@opentelemetry/exporter-trace-otlp-http',
      '@opentelemetry/exporter-trace-otlp-proto',
    ],
    plugins: [
      {
        name: 'claude-code-build',
        setup(build) {
          // Shim bun:bundle → our feature() implementation
          build.onResolve({ filter: /^bun:bundle$/ }, () => ({
            path: 'bun:bundle',
            namespace: 'bun-bundle-shim',
          }))
          build.onLoad({ filter: /.*/, namespace: 'bun-bundle-shim' }, () => ({
            contents: bunBundleShimSource,
            loader: 'js',
          }))

          // Resolve .js imports to .ts/.tsx source files
          build.onResolve({ filter: /\.js$/ }, (args) => {
            // Only handle relative imports (not npm packages)
            if (!args.path.startsWith('.') && !args.path.startsWith('/')) return

            const dir = args.importer ? dirname(args.importer) : projectRoot
            const jsPath = resolve(dir, args.path)

            // Try .ts, .tsx replacements for the .js extension
            const basePath = jsPath.replace(/\.js$/, '')
            for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
              const candidate = basePath + ext
              if (existsSync(candidate)) {
                return { path: candidate }
              }
            }
            // Try index files for directory imports
            for (const ext of ['.ts', '.tsx', '.js']) {
              const candidate = join(basePath, 'index' + ext)
              if (existsSync(candidate)) {
                return { path: candidate }
              }
            }

            // If we can't find it, let the bundler handle the error
            return undefined
          })

          // Resolve .md file imports (skill definitions)
          build.onResolve({ filter: /\.md$/ }, (args) => {
            if (!args.path.startsWith('.')) return
            const dir = args.importer ? dirname(args.importer) : projectRoot
            const mdPath = resolve(dir, args.path)
            if (existsSync(mdPath)) {
              return { path: mdPath, namespace: 'md-loader' }
            }
            // Return empty module for missing .md files
            return { path: args.path, namespace: 'missing-md' }
          })
          build.onLoad({ filter: /.*/, namespace: 'md-loader' }, async (args) => {
            const content = await Bun.file(args.path).text()
            return { contents: `export default ${JSON.stringify(content)};`, loader: 'js' }
          })
          build.onLoad({ filter: /.*/, namespace: 'missing-md' }, () => ({
            contents: `export default "";`,
            loader: 'js',
          }))

          // Resolve .d.ts imports (type definitions imported at runtime)
          build.onResolve({ filter: /\.d\.ts$/ }, (args) => {
            return { path: args.path, namespace: 'dts-stub' }
          })
          build.onLoad({ filter: /.*/, namespace: 'dts-stub' }, () => ({
            contents: `export default "";`,
            loader: 'js',
          }))

          // Resolve src/* path aliases to project root
          build.onResolve({ filter: /^src\// }, (args) => {
            const relative = args.path.replace(/^src\//, '')
            // Try with .ts/.tsx extension
            const basePath = resolve(projectRoot, relative.replace(/\.js$/, ''))
            for (const ext of ['.ts', '.tsx', '.js', '']) {
              const candidate = basePath + ext
              if (existsSync(candidate)) {
                return { path: candidate }
              }
            }
            return { path: resolve(projectRoot, relative) }
          })

          // Resolve internal packages to stubs
          const internalPackages = [
            '@ant/claude-for-chrome-mcp',
            '@ant/computer-use-input',
            '@ant/computer-use-mcp',
            '@ant/computer-use-swift',
            '@anthropic-ai/mcpb',
            '@anthropic-ai/sandbox-runtime',
            'color-diff-napi',
          ]
          for (const pkg of internalPackages) {
            const escapedPkg = pkg.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
            build.onResolve({ filter: new RegExp(`^${escapedPkg}(\\/.*)?$`) }, (args) => {
              const subpath = args.path.replace(pkg, '')
              const stubFile = subpath
                ? join(stubsDir, pkg, subpath.replace(/^\//, '') + (subpath.endsWith('.ts') ? '' : '.ts'))
                : join(stubsDir, pkg, 'index.ts')
              return { path: stubFile }
            })
          }
        },
      },
    ],
  })

  if (!result.success) {
    console.error('Build failed:')
    for (const log of result.logs) {
      console.error(`  ${log}`)
    }
    process.exit(1)
  }

  console.log('Build succeeded!')
  for (const output of result.outputs) {
    const sizeKB = (output.size / 1024).toFixed(0)
    console.log(`  ${output.path} (${sizeKB} KB)`)
  }

  if (shouldCompile) {
    console.log('\nCompiling to standalone binary...')
    const proc = Bun.spawn(['bun', 'build', '--compile', './dist/cli.js', '--outfile', './dist/claude'], {
      stdout: 'inherit',
      stderr: 'inherit',
    })
    const exitCode = await proc.exited
    if (exitCode !== 0) {
      console.error('Compilation failed')
      process.exit(1)
    }
    console.log('Binary: dist/claude')
  }
}

build()
