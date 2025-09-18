import { Plugin } from 'prosemirror-state'
import { Manager } from '../types'

export class PluginManager implements Manager {
  private plugins: Map<string, Plugin> = new Map()
  private activePlugins: Set<string> = new Set()

  initialize(): void {
    // Initialize plugin system
  }

  destroy(): void {
    this.plugins.clear()
    this.activePlugins.clear()
  }

  register(name: string, plugin: Plugin): void {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' is already registered`)
    }
    this.plugins.set(name, plugin)
  }

  unregister(name: string): void {
    this.activePlugins.delete(name)
    this.plugins.delete(name)
  }

  activate(name: string): void {
    if (!this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' is not registered`)
    }
    this.activePlugins.add(name)
  }

  deactivate(name: string): void {
    this.activePlugins.delete(name)
  }

  isActive(name: string): boolean {
    return this.activePlugins.has(name)
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins)
      .map(name => this.plugins.get(name))
      .filter((plugin): plugin is Plugin => plugin !== undefined)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getRegisteredNames(): string[] {
    return Array.from(this.plugins.keys())
  }

  getActiveNames(): string[] {
    return Array.from(this.activePlugins)
  }
}