/**
 * Secure storage types for credential management.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/oauth.rs (OAuthTokenSet)
 */

export interface SecureStorageData {
  apiKey?: string
  oauthToken?: string
  refreshToken?: string
  expiresAt?: number
}
