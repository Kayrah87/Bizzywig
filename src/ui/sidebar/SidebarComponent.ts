import { SidebarTab, SidebarComponent as ISidebarComponent } from '../../core/types'

export class SidebarComponent {
  private container: HTMLElement
  private tabs: SidebarTab[] = []
  private activeTabId: string | null = null
  private activeComponent: ISidebarComponent | null = null

  constructor(container: HTMLElement) {
    this.container = container
    this.render()
  }

  registerTab(tab: SidebarTab): void {
    if (this.tabs.find(t => t.id === tab.id)) {
      throw new Error(`Sidebar tab '${tab.id}' is already registered`)
    }
    
    this.tabs.push(tab)
    if (!this.activeTabId) {
      this.setActiveTab(tab.id)
    } else {
      this.render()
    }
  }

  unregisterTab(tabId: string): void {
    const index = this.tabs.findIndex(tab => tab.id === tabId)
    if (index > -1) {
      // If this was the active tab, switch to another or clear
      if (this.activeTabId === tabId) {
        if (this.activeComponent?.destroy) {
          this.activeComponent.destroy()
        }
        this.activeComponent = null
        this.activeTabId = this.tabs.length > 1 
          ? this.tabs[index === 0 ? 1 : index - 1].id 
          : null
      }
      
      this.tabs.splice(index, 1)
      this.render()
    }
  }

  setActiveTab(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId)
    if (!tab) return

    // Destroy previous component
    if (this.activeComponent?.destroy) {
      this.activeComponent.destroy()
    }

    this.activeTabId = tabId
    this.activeComponent = tab.component
    this.render()
  }

  private render(): void {
    this.container.innerHTML = ''
    this.container.className = 'bizzywig-sidebar'

    if (this.tabs.length === 0) {
      return
    }

    // Create tab buttons
    const tabButtons = document.createElement('div')
    tabButtons.className = 'sidebar-tab-buttons'

    this.tabs.forEach(tab => {
      const button = document.createElement('button')
      button.className = `sidebar-tab-button ${
        tab.id === this.activeTabId ? 'active' : ''
      }`
      button.title = tab.title
      
      if (tab.icon) {
        const icon = document.createElement('span')
        icon.className = 'sidebar-tab-icon'
        icon.textContent = tab.icon
        button.appendChild(icon)
      } else {
        button.textContent = tab.title
      }

      button.addEventListener('click', () => {
        this.setActiveTab(tab.id)
      })

      tabButtons.appendChild(button)
    })

    this.container.appendChild(tabButtons)

    // Create content area
    const contentArea = document.createElement('div')
    contentArea.className = 'sidebar-content'

    if (this.activeComponent) {
      this.activeComponent.render(contentArea)
    }

    this.container.appendChild(contentArea)
  }

  getTabs(): SidebarTab[] {
    return [...this.tabs]
  }

  getActiveTab(): SidebarTab | null {
    return this.tabs.find(tab => tab.id === this.activeTabId) || null
  }

  destroy(): void {
    if (this.activeComponent?.destroy) {
      this.activeComponent.destroy()
    }
    this.container.innerHTML = ''
    this.tabs = []
    this.activeTabId = null
    this.activeComponent = null
  }
}