import { Plugin } from 'prosemirror-state'
import { NodeView } from 'prosemirror-view'

export type Command = (state: any, dispatch?: (tr: any) => void) => boolean
export type CommandFactory = (...args: any[]) => Command

export interface ExtensionSchema {
  nodes?: Record<string, any>
  marks?: Record<string, any>
}

export interface ExtensionConfig {
  name: string
  priority?: number
  schema?: ExtensionSchema
  plugins?: Plugin[]
  commands?: Record<string, Command | any>
  nodeViews?: Record<string, NodeView>
  keymap?: Record<string, Command>
}

export interface Manager {
  initialize(): void
  destroy(): void
}

export interface MenuSection {
  id: string
  title: string
  items: MenuItem[]
}

export interface MenuItem {
  id: string
  title: string
  command?: string
  icon?: string
  disabled?: boolean
}

export interface MenuTab {
  id: string
  title: string
  sections: MenuSection[]
}

export interface SidebarTab {
  id: string
  title: string
  component: SidebarComponent
  icon?: string
}

export interface SidebarComponent {
  render(container: HTMLElement): void
  destroy?(): void
}

export interface ViewState {
  documentVersion: number
  selection: any
  scrollPosition: number
  activeExtensions: string[]
}

export interface DocumentChange {
  type: 'content' | 'selection' | 'scroll' | 'extension'
  data: any
  timestamp: number
}