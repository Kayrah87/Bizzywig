import { 
  Bizzywig, 
  DefaultExtension, 
  TableExtension, 
  FontExtension,
  RibbonComponent,
  SidebarComponent
} from '../index'
import { Schema } from 'prosemirror-model'

// Create a complete Bizzywig editor demo
export class BizzywigDemo {
  private bizzywig: Bizzywig
  private ribbon: RibbonComponent | null = null
  private sidebar: SidebarComponent | null = null

  constructor() {
    this.bizzywig = new Bizzywig()
  }

  async initialize(container: HTMLElement): Promise<void> {
    // Initialize Bizzywig
    await this.bizzywig.initialize()

    // Register extensions
    const defaultExt = new DefaultExtension()
    defaultExt.configure()
    this.bizzywig.extensions.register(defaultExt.getConfig())

    const tableExt = new TableExtension()
    tableExt.configure()
    this.bizzywig.extensions.register(tableExt.getConfig())

    const fontExt = new FontExtension()
    fontExt.configure()
    this.bizzywig.extensions.register(fontExt.getConfig())

    // Activate extensions
    this.bizzywig.extensions.activate('default')
    this.bizzywig.extensions.activate('table')
    this.bizzywig.extensions.activate('font')

    // Build schema from active extensions
    const activeExtensions = this.bizzywig.extensions.getActiveExtensions()
    const schemaSpec = this.buildSchemaFromExtensions(activeExtensions)
    const schema = new Schema(schemaSpec)
    this.bizzywig.document.setSchema(schema)

    // Set up UI
    this.setupUI(container)

    // Set up ribbon menus
    this.setupRibbonMenus()

    // Set up sidebar tabs
    this.setupSidebarTabs()
  }

  private buildSchemaFromExtensions(extensions: any[]): any {
    const nodes: any = {}
    const marks: any = {}

    extensions.forEach(ext => {
      if (ext.schema?.nodes) {
        Object.assign(nodes, ext.schema.nodes)
      }
      if (ext.schema?.marks) {
        Object.assign(marks, ext.schema.marks)
      }
    })

    return { nodes, marks }
  }

  private setupUI(container: HTMLElement): void {
    container.innerHTML = `
      <div class="bizzywig-editor">
        <div id="ribbon-container"></div>
        <div class="bizzywig-main">
          <div id="document-container" class="bizzywig-document"></div>
          <div id="sidebar-container"></div>
        </div>
      </div>
    `

    // Initialize components
    const ribbonContainer = container.querySelector('#ribbon-container') as HTMLElement
    const sidebarContainer = container.querySelector('#sidebar-container') as HTMLElement
    const documentContainer = container.querySelector('#document-container') as HTMLElement

    this.ribbon = new RibbonComponent(ribbonContainer)
    this.sidebar = new SidebarComponent(sidebarContainer)

    // Create editor
    this.bizzywig.createEditor(documentContainer)
  }

  private setupRibbonMenus(): void {
    if (!this.ribbon) return

    // Register Home tab
    this.bizzywig.menu.registerTab({
      id: 'home',
      title: 'Home',
      sections: []
    })

    // Register Format section
    this.bizzywig.menu.registerSection('home', {
      id: 'format',
      title: 'Format',
      items: []
    })

    // Register format items
    this.bizzywig.menu.registerItem('format', {
      id: 'bold',
      title: 'Bold',
      command: 'toggleBold',
      icon: 'B'
    })

    this.bizzywig.menu.registerItem('format', {
      id: 'italic',
      title: 'Italic',
      command: 'toggleItalic',
      icon: 'I'
    })

    this.bizzywig.menu.registerItem('format', {
      id: 'code',
      title: 'Code',
      command: 'toggleCode',
      icon: '<>'
    })

    // Register Insert tab
    this.bizzywig.menu.registerTab({
      id: 'insert',
      title: 'Insert',
      sections: []
    })

    // Register Table section
    this.bizzywig.menu.registerSection('insert', {
      id: 'tables',
      title: 'Tables',
      items: []
    })

    this.bizzywig.menu.registerItem('tables', {
      id: 'insertTable',
      title: 'Table',
      command: 'insertTable',
      icon: '⊞'
    })

    // Update ribbon with tabs
    this.ribbon.setTabs(this.bizzywig.menu.getTabs())
  }

  private setupSidebarTabs(): void {
    if (!this.sidebar) return

    // Register Properties tab
    this.sidebar.registerTab({
      id: 'properties',
      title: 'Properties',
      icon: '⚙',
      component: {
        render: (container: HTMLElement) => {
          container.innerHTML = `
            <h3>Document Properties</h3>
            <div>
              <label>Title:</label>
              <input type="text" id="doc-title" placeholder="Document title">
            </div>
            <div style="margin-top: 12px;">
              <label>Author:</label>
              <input type="text" id="doc-author" placeholder="Author name">
            </div>
            <div style="margin-top: 12px;">
              <button id="save-props">Save Properties</button>
            </div>
          `

          const saveButton = container.querySelector('#save-props') as HTMLButtonElement
          saveButton.addEventListener('click', () => {
            console.log('Properties saved')
          })
        }
      }
    })

    // Register Extensions tab
    this.sidebar.registerTab({
      id: 'extensions',
      title: 'Extensions',
      icon: '🧩',
      component: {
        render: (container: HTMLElement) => {
          container.innerHTML = `
            <h3>Active Extensions</h3>
            <div id="extension-list"></div>
          `

          const extensionList = container.querySelector('#extension-list') as HTMLElement
          const activeExtensions = this.bizzywig.extensions.getActive()
          
          activeExtensions.forEach((name: string) => {
            const item = document.createElement('div')
            item.style.cssText = 'padding: 8px; margin: 4px 0; background: #f0f0f0; border-radius: 4px;'
            item.innerHTML = `
              <strong>${name}</strong>
              <button style="float: right; padding: 2px 6px; font-size: 12px;" 
                      onclick="this.parentElement.style.opacity='0.5'">Disable</button>
            `
            extensionList.appendChild(item)
          })
        }
      }
    })
  }

  destroy(): void {
    if (this.ribbon) {
      this.ribbon.destroy()
    }
    if (this.sidebar) {
      this.sidebar.destroy()
    }
    this.bizzywig.destroy()
  }
}