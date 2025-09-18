// Core exports
export { Bizzywig } from './core/Bizzywig'

// Manager exports
export { ViewStateManager } from './core/managers/ViewStateManager'
export { ExtensionManager } from './core/managers/ExtensionManager'
export { MenuManager } from './core/managers/MenuManager'
export { DocumentManager } from './core/managers/DocumentManager'
export { PluginManager } from './core/managers/PluginManager'

// Extension base class
export { Extension } from './core/extensions/Extension'

// Built-in extensions
export { DefaultExtension } from './extensions/default/DefaultExtension'
export { TableExtension } from './extensions/table/TableExtension'
export { FontExtension } from './extensions/font/FontExtension'

// UI components
export { RibbonComponent } from './ui/ribbon/RibbonComponent'
export { SidebarComponent } from './ui/sidebar/SidebarComponent'

// Types
export type {
  ExtensionSchema,
  ExtensionConfig,
  Manager,
  MenuSection,
  MenuItem,
  MenuTab,
  SidebarTab,
  SidebarComponent as ISidebarComponent,
  ViewState,
  DocumentChange,
} from './core/types'

// Styles
import './styles/bizzywig.css'