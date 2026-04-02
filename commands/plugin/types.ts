/**
 * Plugin command view state types.
 * Used by 6 plugin UI components.
 */

export type ViewState =
  | { type: 'menu' }
  | { type: 'browse-marketplace'; targetMarketplace?: string; targetPlugin?: string }
  | { type: 'add-marketplace'; initialValue?: string }
  | { type: 'manage-plugins'; targetPlugin?: string; targetMarketplace?: string; action?: 'enable' | 'disable' | 'uninstall' }
  | { type: 'manage-marketplaces'; targetMarketplace?: string; action?: 'remove' | 'update' }
  | { type: 'discover-plugins'; targetPlugin?: string }
  | { type: 'help' }
  | { type: 'validate'; path: string }
  | { type: 'marketplace-list' }
  | { type: 'marketplace-menu' }

export interface PluginSettingsProps {
  onComplete: (message: string) => void
  args?: string
  showMcpRedirectMessage?: boolean
}
