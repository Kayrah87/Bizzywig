import { MenuTab, MenuSection, MenuItem } from '../../core/types'

export class RibbonComponent {
  private container: HTMLElement
  private tabs: MenuTab[] = []
  private activeTabId: string | null = null

  constructor(container: HTMLElement) {
    this.container = container
    this.render()
  }

  setTabs(tabs: MenuTab[]): void {
    this.tabs = tabs
    if (tabs.length > 0 && !this.activeTabId) {
      this.activeTabId = tabs[0].id
    }
    this.render()
  }

  setActiveTab(tabId: string): void {
    if (this.tabs.find(tab => tab.id === tabId)) {
      this.activeTabId = tabId
      this.render()
    }
  }

  private render(): void {
    this.container.innerHTML = ''
    this.container.className = 'bizzywig-ribbon'

    // Create tab headers
    const tabHeaders = document.createElement('div')
    tabHeaders.className = 'ribbon-tab-headers'

    this.tabs.forEach(tab => {
      const tabHeader = document.createElement('button')
      tabHeader.className = `ribbon-tab-header ${
        tab.id === this.activeTabId ? 'active' : ''
      }`
      tabHeader.textContent = tab.title
      tabHeader.addEventListener('click', () => {
        this.setActiveTab(tab.id)
      })
      tabHeaders.appendChild(tabHeader)
    })

    this.container.appendChild(tabHeaders)

    // Create tab content
    const activeTab = this.tabs.find(tab => tab.id === this.activeTabId)
    if (activeTab) {
      const tabContent = document.createElement('div')
      tabContent.className = 'ribbon-tab-content'

      activeTab.sections.forEach(section => {
        const sectionElement = this.renderSection(section)
        tabContent.appendChild(sectionElement)
      })

      this.container.appendChild(tabContent)
    }
  }

  private renderSection(section: MenuSection): HTMLElement {
    const sectionElement = document.createElement('div')
    sectionElement.className = 'ribbon-section'

    const sectionTitle = document.createElement('div')
    sectionTitle.className = 'ribbon-section-title'
    sectionTitle.textContent = section.title

    const sectionItems = document.createElement('div')
    sectionItems.className = 'ribbon-section-items'

    section.items.forEach(item => {
      const itemElement = this.renderItem(item)
      sectionItems.appendChild(itemElement)
    })

    sectionElement.appendChild(sectionItems)
    sectionElement.appendChild(sectionTitle)

    return sectionElement
  }

  private renderItem(item: MenuItem): HTMLElement {
    const itemElement = document.createElement('button')
    itemElement.className = `ribbon-item ${item.disabled ? 'disabled' : ''}`
    itemElement.title = item.title

    if (item.icon) {
      const icon = document.createElement('span')
      icon.className = 'ribbon-item-icon'
      icon.textContent = item.icon
      itemElement.appendChild(icon)
    }

    const title = document.createElement('span')
    title.className = 'ribbon-item-title'
    title.textContent = item.title
    itemElement.appendChild(title)

    if (item.command && !item.disabled) {
      itemElement.addEventListener('click', () => {
        this.executeCommand(item.command!)
      })
    }

    return itemElement
  }

  private executeCommand(commandName: string): void {
    // This would integrate with the command system
    console.log(`Executing command: ${commandName}`)
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}