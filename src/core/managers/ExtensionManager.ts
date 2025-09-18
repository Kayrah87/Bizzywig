import { Manager, ExtensionConfig } from '../types'
import { ViewStateManager } from './ViewStateManager'

export class ExtensionManager implements Manager {
  private extensions: Map<string, ExtensionConfig> = new Map()
  private activeExtensions: Set<string> = new Set()
  private viewStateManager: ViewStateManager

  constructor(viewStateManager: ViewStateManager) {
    this.viewStateManager = viewStateManager
  }

  initialize(): void {
    // Initialize extension system
  }

  destroy(): void {
    this.deactivateAll()
    this.extensions.clear()
  }

  register(config: ExtensionConfig): void {
    if (this.extensions.has(config.name)) {
      throw new Error(`Extension '${config.name}' is already registered`)
    }

    this.extensions.set(config.name, config)
  }

  unregister(name: string): void {
    if (this.isActive(name)) {
      this.deactivate(name)
    }
    this.extensions.delete(name)
  }

  activate(name: string): void {
    const extension = this.extensions.get(name)
    if (!extension) {
      throw new Error(`Extension '${name}' is not registered`)
    }

    if (this.activeExtensions.has(name)) {
      return // Already active
    }

    this.activeExtensions.add(name)
    
    // Notify view state manager
    this.viewStateManager.applyDocumentChange({
      type: 'extension',
      data: { action: 'activate', extension: name },
      timestamp: Date.now(),
    })
  }

  deactivate(name: string): void {
    if (!this.activeExtensions.has(name)) {
      return // Not active
    }

    this.activeExtensions.delete(name)
    
    // Notify view state manager
    this.viewStateManager.applyDocumentChange({
      type: 'extension',
      data: { action: 'deactivate', extension: name },
      timestamp: Date.now(),
    })
  }

  deactivateAll(): void {
    const activeExtensions = Array.from(this.activeExtensions)
    activeExtensions.forEach(name => this.deactivate(name))
  }

  isActive(name: string): boolean {
    return this.activeExtensions.has(name)
  }

  getActive(): string[] {
    return Array.from(this.activeExtensions)
  }

  getRegistered(): string[] {
    return Array.from(this.extensions.keys())
  }

  getExtension(name: string): ExtensionConfig | undefined {
    return this.extensions.get(name)
  }

  getActiveExtensions(): ExtensionConfig[] {
    return Array.from(this.activeExtensions)
      .map(name => this.extensions.get(name))
      .filter((ext): ext is ExtensionConfig => ext !== undefined)
  }

  getExtensionsByPriority(): ExtensionConfig[] {
    return Array.from(this.extensions.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }
}