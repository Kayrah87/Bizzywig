# Bizzywig

A truly useful business document editor built with TypeScript, Vite, and ProseMirror using a powerful registry pattern.

## Features

- **Registry Pattern Architecture**: Core managers handle extensions, menus, plugins, documents, and view state
- **Extensible Framework**: Easy-to-create extensions for custom functionality
- **Built-in Extensions**: 
  - **Default/Core**: Basic ProseMirror functionality (bold, italic, code, headings, etc.)
  - **Table**: Full table support with editing, resizing, and commands
  - **Font**: Advanced font formatting (size, family, colors)
- **Modern UI Components**:
  - **Ribbon**: Tab-based menu system (Tabs → Sections → Items)
  - **Sidebar**: Registerable tabs and components
- **State Management**: ViewStateManager ensures all document changes are tracked
- **TypeScript**: Full type safety and IntelliSense support

## Installation

```bash
npm install bizzywig
```

## Quick Start

```typescript
import { 
  Bizzywig, 
  DefaultExtension, 
  TableExtension, 
  FontExtension 
} from 'bizzywig'
import { Schema } from 'prosemirror-model'

// Create Bizzywig instance
const editor = new Bizzywig()
await editor.initialize()

// Register extensions
const defaultExt = new DefaultExtension()
defaultExt.configure()
editor.extensions.register(defaultExt.getConfig())

const tableExt = new TableExtension()
tableExt.configure()
editor.extensions.register(tableExt.getConfig())

// Activate extensions
editor.extensions.activate('default')
editor.extensions.activate('table')

// Build schema and create editor
const schema = new Schema(buildSchemaFromExtensions(editor.extensions.getActiveExtensions()))
editor.document.setSchema(schema)
editor.createEditor(document.getElementById('editor-container'))
```

## Architecture

### Core Managers

#### ViewStateManager
Central state management that tracks all document changes to prevent stale state:

```typescript
// All document changes must go through ViewStateManager
editor.viewState.applyDocumentChange({
  type: 'content',
  data: { /* change data */ },
  timestamp: Date.now()
})

// Subscribe to state changes
const unsubscribe = editor.viewState.subscribe((state) => {
  console.log('State updated:', state)
})
```

#### ExtensionManager
Registry for extensions with priority-based loading:

```typescript
// Register an extension
editor.extensions.register({
  name: 'my-extension',
  priority: 100,
  schema: { nodes: {...}, marks: {...} },
  commands: { myCommand: (state, dispatch) => {...} }
})

// Activate/deactivate extensions
editor.extensions.activate('my-extension')
editor.extensions.deactivate('my-extension')
```

#### MenuManager
Hierarchical menu system (Tabs → Sections → Items):

```typescript
// Register a tab
editor.menu.registerTab({
  id: 'format',
  title: 'Format',
  sections: []
})

// Register a section
editor.menu.registerSection('format', {
  id: 'text-formatting',
  title: 'Text',
  items: []
})

// Register menu items
editor.menu.registerItem('text-formatting', {
  id: 'bold',
  title: 'Bold',
  command: 'toggleBold',
  icon: 'B'
})
```

### Creating Custom Extensions

```typescript
import { Extension } from 'bizzywig'

export class MyExtension extends Extension {
  readonly name = 'my-extension'
  readonly priority = 500

  configure(): void {
    // Add custom nodes
    this.addNode('custom_block', {
      content: 'inline*',
      group: 'block',
      toDOM: () => ['div', { class: 'custom-block' }, 0],
      parseDOM: [{ tag: 'div.custom-block' }]
    })

    // Add custom marks
    this.addMark('highlight', {
      toDOM: () => ['mark', 0],
      parseDOM: [{ tag: 'mark' }]
    })

    // Add commands
    this.addCommand('toggleHighlight', (state, dispatch) => {
      // Command implementation
    })

    // Add plugins
    this.addPlugin(myCustomPlugin)
  }
}
```

### UI Components

#### Ribbon Component
```typescript
import { RibbonComponent } from 'bizzywig'

const ribbon = new RibbonComponent(document.getElementById('ribbon'))
ribbon.setTabs(editor.menu.getTabs())
```

#### Sidebar Component
```typescript
import { SidebarComponent } from 'bizzywig'

const sidebar = new SidebarComponent(document.getElementById('sidebar'))
sidebar.registerTab({
  id: 'properties',
  title: 'Properties',
  icon: '⚙',
  component: {
    render: (container) => {
      container.innerHTML = '<div>Properties panel</div>'
    }
  }
})
```

## Built-in Extensions

### DefaultExtension
Core ProseMirror functionality:
- Nodes: doc, paragraph, text, heading, blockquote, code_block
- Marks: strong, em, code, link
- Commands: toggleBold, toggleItalic, toggleCode
- Keyboard shortcuts: Mod-b, Mod-i, Mod-`

### TableExtension  
Full table support:
- Nodes: table, table_row, table_cell, table_header
- Commands: insertTable, addRow/Column, deleteRow/Column, mergeCells
- Features: Column resizing, cell selection, navigation

### FontExtension
Advanced typography:
- Marks: fontSize, fontFamily, textColor, backgroundColor
- Commands: setFontSize, setFontFamily, setTextColor, setBackgroundColor

## Development

```bash
# Install dependencies
npm install

# Type check
npm run type-check

# Build
npm run build

# Test
npm test

# Development server
npm run dev
```

## Example Usage

See `demo.html` for a complete working example that demonstrates:
- Extension registration and activation
- Ribbon menu setup
- Sidebar configuration  
- Full editor integration

## License

MIT License - see LICENSE file for details.