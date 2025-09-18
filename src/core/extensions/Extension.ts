import { Plugin } from 'prosemirror-state'
import { NodeView } from 'prosemirror-view'
import { ExtensionConfig, ExtensionSchema } from '../types'

export type Command = (state: any, dispatch?: (tr: any) => void) => boolean

export abstract class Extension {
  abstract readonly name: string
  abstract readonly priority: number

  protected schema: ExtensionSchema = {}
  protected plugins: Plugin[] = []
  protected commands: Record<string, Command | any> = {}
  protected nodeViews: Record<string, NodeView> = {}
  protected keymap: Record<string, Command> = {}

  abstract configure(): void

  getConfig(): ExtensionConfig {
    return {
      name: this.name,
      priority: this.priority,
      schema: this.schema,
      plugins: this.plugins,
      commands: this.commands,
      nodeViews: this.nodeViews,
      keymap: this.keymap,
    }
  }

  protected addNode(name: string, spec: any): void {
    if (!this.schema.nodes) {
      this.schema.nodes = {}
    }
    this.schema.nodes[name] = spec
  }

  protected addMark(name: string, spec: any): void {
    if (!this.schema.marks) {
      this.schema.marks = {}
    }
    this.schema.marks[name] = spec
  }

  protected addPlugin(plugin: Plugin): void {
    this.plugins.push(plugin)
  }

  protected addCommand(name: string, command: Command | any): void {
    this.commands[name] = command
  }

  protected addNodeView(name: string, nodeView: NodeView): void {
    this.nodeViews[name] = nodeView
  }

  protected addKeymap(key: string, command: Command): void {
    this.keymap[key] = command
  }
}