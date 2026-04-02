# Missing Source Files

**0 files remaining.** All 115 originally missing files have been resolved.

Last scanned: 2026-04-02

## Resolution Summary

| Category | Count | Method |
|----------|-------|--------|
| Types / interfaces | 15 | Implemented from Rust/Python ports + usage inference |
| Tool modules | 21 | Stubs (feature-gated, ant-only) |
| Skill content (`.md`) | 48 | Empty markdown placeholders |
| Feature modules | 12 | Stubs with correct export signatures |
| UI components | 11 | Null-export stubs |
| Service modules | 10 | Implementations from Rust/Python + stubs |
| Command modules | 11 | Null-export stubs |
| Ink/framework | 3 | Type definitions + event stubs |
| Text/prompt files | 4 | Placeholder text |
| Other utilities | 8 | Stubs with correct export signatures |

## Source Attribution

| Source | Files |
|--------|-------|
| Rust port (`claw-code/rust/`) | `types/message.ts`, `services/oauth/types.ts`, `services/lsp/types.ts`, `services/analytics/metadata.ts`, `constants/querySource.ts`, `keybindings/types.ts`, `components/mcp/types.ts`, `utils/secureStorage/types.ts` |
| Python port (`claw-code/src/`) | `query/transitions.ts`, `jobs/classifier.ts`, `proactive/index.ts`, `services/contextCollapse/index.ts`, `services/compact/reactiveCompact.ts` |
| nbformat spec | `types/notebook.ts` |
| type-fest / type-challenges | `types/utils.ts` (DeepImmutable, Permutations) |
| Usage inference (grep imports) | `components/agents/new-agent-creation/types.ts`, `commands/plugin/types.ts`, `cli/transports/Transport.ts`, `components/wizard/types.ts`, + all remaining |
