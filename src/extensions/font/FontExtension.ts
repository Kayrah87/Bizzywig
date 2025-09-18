import { Extension } from '../../core/extensions/Extension'
import { toggleMark } from 'prosemirror-commands'

export class FontExtension extends Extension {
  readonly name = 'font'
  readonly priority = 300

  configure(): void {
    // Add font-related marks
    this.addMark('fontSize', {
      attrs: { size: { default: null } },
      parseDOM: [
        {
          tag: 'span[style*="font-size"]',
          getAttrs: (dom: HTMLElement) => {
            const size = dom.style.fontSize
            return size ? { size } : false
          },
        },
      ],
      toDOM: (mark: any) => [
        'span',
        {
          style: `font-size: ${mark.attrs.size}`,
        },
        0,
      ],
    })

    this.addMark('fontFamily', {
      attrs: { family: { default: null } },
      parseDOM: [
        {
          tag: 'span[style*="font-family"]',
          getAttrs: (dom: HTMLElement) => {
            const family = dom.style.fontFamily
            return family ? { family } : false
          },
        },
      ],
      toDOM: (mark: any) => [
        'span',
        {
          style: `font-family: ${mark.attrs.family}`,
        },
        0,
      ],
    })

    this.addMark('textColor', {
      attrs: { color: { default: null } },
      parseDOM: [
        {
          tag: 'span[style*="color"]',
          getAttrs: (dom: HTMLElement) => {
            const color = dom.style.color
            return color ? { color } : false
          },
        },
      ],
      toDOM: (mark: any) => [
        'span',
        {
          style: `color: ${mark.attrs.color}`,
        },
        0,
      ],
    })

    this.addMark('backgroundColor', {
      attrs: { color: { default: null } },
      parseDOM: [
        {
          tag: 'span[style*="background-color"]',
          getAttrs: (dom: HTMLElement) => {
            const color = dom.style.backgroundColor
            return color ? { color } : false
          },
        },
      ],
      toDOM: (mark: any) => [
        'span',
        {
          style: `background-color: ${mark.attrs.color}`,
        },
        0,
      ],
    })

    // Add font commands (as factory functions)
    this.commands.setFontSize = (size: string) => (state: any, dispatch?: any) => {
      const { fontSize } = state.schema.marks
      const command = toggleMark(fontSize, { size })
      return command(state, dispatch)
    }

    this.commands.setFontFamily = (family: string) => (state: any, dispatch?: any) => {
      const { fontFamily } = state.schema.marks
      const command = toggleMark(fontFamily, { family })
      return command(state, dispatch)
    }

    this.commands.setTextColor = (color: string) => (state: any, dispatch?: any) => {
      const { textColor } = state.schema.marks
      const command = toggleMark(textColor, { color })
      return command(state, dispatch)
    }

    this.commands.setBackgroundColor = (color: string) => (state: any, dispatch?: any) => {
      const { backgroundColor } = state.schema.marks
      const command = toggleMark(backgroundColor, { color })
      return command(state, dispatch)
    }
  }
}