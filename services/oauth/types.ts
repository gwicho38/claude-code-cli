/**
 * OAuth types for Claude Code CLI authentication.
 *
 * Translated from:
 *   - Rust: claw-code/rust/crates/runtime/src/oauth.rs
 *   - Rust: claw-code/rust/crates/runtime/src/config.rs (OAuthConfig)
 */

export interface OAuthTokenSet {
  access_token: string
  refresh_token?: string
  expires_at?: number
  scopes: string[]
}

export type PkceChallengeMethod = 'S256'

export interface PkceCodePair {
  verifier: string
  challenge: string
  challenge_method: PkceChallengeMethod
}

export interface OAuthAuthorizationRequest {
  authorize_url: string
  client_id: string
  redirect_uri: string
  scopes: string[]
  state: string
  code_challenge: string
  code_challenge_method: PkceChallengeMethod
  extra_params: Record<string, string>
}

export interface OAuthTokenExchangeRequest {
  grant_type: 'authorization_code'
  code: string
  redirect_uri: string
  client_id: string
  code_verifier: string
  state: string
}

export interface OAuthRefreshRequest {
  grant_type: 'refresh_token'
  refresh_token: string
  client_id: string
  scopes: string[]
}

export interface OAuthCallbackParams {
  code?: string
  state?: string
  error?: string
  error_description?: string
}

export interface OAuthConfig {
  client_id: string
  authorize_url: string
  token_url: string
  callback_port?: number
  manual_redirect_url?: string
  scopes: string[]
}
