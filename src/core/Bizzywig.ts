import { ViewStateManager } from './managers/ViewStateManager'
import { ExtensionManager } from './managers/ExtensionManager'
import { MenuManager } from './managers/MenuManager'
import { DocumentManager } from './managers/DocumentManager'
import { PluginManager } from './managers/PluginManager'
import { Manager } from './types'

export class Bizzywig {
  public readonly viewState: ViewStateManager
  public readonly extensions: ExtensionManager
  public readonly menu: MenuManager
  public readonly document: DocumentManager
  public readonly plugins: PluginManager

  private managers: Manager[]
  private initialized = false

  constructor() {
    // Initialize managers in dependency order
    this.viewState = new ViewStateManager()
    this.extensions = new ExtensionManager(this.viewState)
    this.menu = new MenuManager()
    this.document = new DocumentManager(this.viewState)
    this.plugins = new PluginManager()

    this.managers = [
      this.viewState,
      this.plugins,
      this.extensions,
      this.menu,
      this.document,
    ]
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('Bizzywig is already initialized')
    }

    // Initialize all managers
    for (const manager of this.managers) {
      manager.initialize()
    }

    this.initialized = true
  }

  destroy(): void {
    if (!this.initialized) {
      return
    }

    // Destroy managers in reverse order
    for (let i = this.managers.length - 1; i >= 0; i--) {
      this.managers[i].destroy()
    }

    this.initialized = false
  }

  isInitialized(): boolean {
    return this.initialized
  }

  createEditor(container: HTMLElement): void {
    if (!this.initialized) {
      throw new Error('Bizzywig must be initialized before creating an editor')
    }

    this.document.createEditorView(container)
  }
}