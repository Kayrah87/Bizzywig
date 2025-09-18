import { Extension } from '../../core/extensions/Extension'
import { schema } from 'prosemirror-schema-basic'
import { toggleMark } from 'prosemirror-commands'

export class DefaultExtension extends Extension {
  readonly name = 'default'
  readonly priority = 1000

  configure(): void {
    // Add basic schema nodes and marks
    this.schema = {
      nodes: {
        doc: schema.spec.nodes.get('doc'),
        paragraph: schema.spec.nodes.get('paragraph'),
        text: schema.spec.nodes.get('text'),
        hard_break: schema.spec.nodes.get('hard_break'),
        heading: schema.spec.nodes.get('heading'),
        blockquote: schema.spec.nodes.get('blockquote'),
        code_block: schema.spec.nodes.get('code_block'),
        horizontal_rule: schema.spec.nodes.get('horizontal_rule'),
      },
      marks: {
        strong: schema.spec.marks.get('strong'),
        em: schema.spec.marks.get('em'),
        code: schema.spec.marks.get('code'),
        link: schema.spec.marks.get('link'),
      },
    }

    // Add basic commands
    this.addCommand('toggleBold', (state: any, dispatch?: any) => {
      const { strong } = state.schema.marks
      return toggleMark(strong)(state, dispatch)
    })

    this.addCommand('toggleItalic', (state: any, dispatch?: any) => {
      const { em } = state.schema.marks
      return toggleMark(em)(state, dispatch)
    })

    this.addCommand('toggleCode', (state: any, dispatch?: any) => {
      const { code } = state.schema.marks
      return toggleMark(code)(state, dispatch)
    })

    // Add basic keymap
    this.addKeymap('Mod-b', this.commands.toggleBold)
    this.addKeymap('Mod-i', this.commands.toggleItalic)
    this.addKeymap('Mod-`', this.commands.toggleCode)
  }
}