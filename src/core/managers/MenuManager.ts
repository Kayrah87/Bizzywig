import { Manager, MenuTab, MenuSection, MenuItem } from '../types'

export class MenuManager implements Manager {
  private tabs: Map<string, MenuTab> = new Map()
  private sections: Map<string, MenuSection> = new Map()
  private items: Map<string, MenuItem> = new Map()

  initialize(): void {
    // Initialize menu system
  }

  destroy(): void {
    this.tabs.clear()
    this.sections.clear()
    this.items.clear()
  }

  // Tab management
  registerTab(tab: MenuTab): void {
    if (this.tabs.has(tab.id)) {
      throw new Error(`Tab '${tab.id}' is already registered`)
    }
    this.tabs.set(tab.id, tab)
  }

  unregisterTab(id: string): void {
    this.tabs.delete(id)
  }

  getTab(id: string): MenuTab | undefined {
    return this.tabs.get(id)
  }

  getTabs(): MenuTab[] {
    return Array.from(this.tabs.values())
  }

  // Section management
  registerSection(tabId: string, section: MenuSection): void {
    const tab = this.tabs.get(tabId)
    if (!tab) {
      throw new Error(`Tab '${tabId}' does not exist`)
    }

    if (this.sections.has(section.id)) {
      throw new Error(`Section '${section.id}' is already registered`)
    }

    this.sections.set(section.id, section)
    
    // Add section to tab if not already present
    if (!tab.sections.find(s => s.id === section.id)) {
      tab.sections.push(section)
    }
  }

  unregisterSection(id: string): void {
    const section = this.sections.get(id)
    if (section) {
      // Remove from all tabs
      this.tabs.forEach(tab => {
        const index = tab.sections.findIndex(s => s.id === id)
        if (index > -1) {
          tab.sections.splice(index, 1)
        }
      })
      this.sections.delete(id)
    }
  }

  getSection(id: string): MenuSection | undefined {
    return this.sections.get(id)
  }

  // Item management
  registerItem(sectionId: string, item: MenuItem): void {
    const section = this.sections.get(sectionId)
    if (!section) {
      throw new Error(`Section '${sectionId}' does not exist`)
    }

    if (this.items.has(item.id)) {
      throw new Error(`Item '${item.id}' is already registered`)
    }

    this.items.set(item.id, item)
    
    // Add item to section if not already present
    if (!section.items.find(i => i.id === item.id)) {
      section.items.push(item)
    }
  }

  unregisterItem(id: string): void {
    const item = this.items.get(id)
    if (item) {
      // Remove from all sections
      this.sections.forEach(section => {
        const index = section.items.findIndex(i => i.id === id)
        if (index > -1) {
          section.items.splice(index, 1)
        }
      })
      this.items.delete(id)
    }
  }

  getItem(id: string): MenuItem | undefined {
    return this.items.get(id)
  }

  updateItem(id: string, updates: Partial<MenuItem>): void {
    const item = this.items.get(id)
    if (!item) {
      throw new Error(`Item '${id}' does not exist`)
    }

    Object.assign(item, updates)
  }

  // Utility methods
  findTabBySection(sectionId: string): MenuTab | undefined {
    for (const tab of this.tabs.values()) {
      if (tab.sections.some(s => s.id === sectionId)) {
        return tab
      }
    }
    return undefined
  }

  findSectionByItem(itemId: string): MenuSection | undefined {
    for (const section of this.sections.values()) {
      if (section.items.some(i => i.id === itemId)) {
        return section
      }
    }
    return undefined
  }
}