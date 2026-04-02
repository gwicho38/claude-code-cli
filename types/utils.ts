/**
 * Shared utility types used across the Claude Code CLI.
 *
 * References:
 *   - type-fest ReadonlyDeep: https://github.com/sindresorhus/type-fest/blob/main/source/readonly-deep.d.ts
 *   - TypeScript type-challenges Permutation: https://github.com/type-challenges/type-challenges/issues/614
 */

// ============================================================================
// DeepImmutable — recursively makes all properties readonly
// ============================================================================

/**
 * Recursively applies `readonly` to every property of T, including nested
 * objects, arrays, Maps, and Sets. Primitives and functions are returned as-is.
 *
 * Used throughout the codebase to define immutable state shapes:
 *   - AppState (state/AppStateStore.ts)
 *   - ToolPermissionContext (Tool.ts)
 *   - Task progress objects (components/tasks/*.tsx)
 *
 * Similar to type-fest's `ReadonlyDeep`, but kept as a self-contained
 * definition to avoid coupling the internal type to the library's version.
 */
export type DeepImmutable<T> =
  T extends (...args: any[]) => any
    ? T // functions are returned as-is
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
      : T extends ReadonlySet<infer U>
        ? ReadonlySet<DeepImmutable<U>>
        : T extends readonly (infer U)[]
          ? readonly DeepImmutable<U>[]
          : T extends object
            ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
            : T

// ============================================================================
// Permutations — exhaustive union-to-tuple for satisfies checks
// ============================================================================

/**
 * Generates all possible tuple orderings of a union type T.
 *
 * Used with `satisfies` to verify an array literal exhaustively lists every
 * member of a union:
 *
 *   const MODES = ['a', 'b'] satisfies Permutations<'a' | 'b'>
 *   //  ✓ compiles — all members present
 *
 *   const MODES = ['a'] satisfies Permutations<'a' | 'b'>
 *   //  ✗ compile error — 'b' missing
 *
 * Caution: this type is exponential in the size of the union (n! branches).
 * Only use with small unions (< 8 members) to avoid hitting TS recursion limits.
 */
export type Permutations<T, U = T> = [T] extends [never]
  ? []
  : T extends T
    ? [T, ...Permutations<Exclude<U, T>>]
    : never
