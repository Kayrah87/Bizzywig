import { Extension } from '../../core/extensions/Extension'
import {
  tableNodes,
  tableEditing,
  columnResizing,
  addRowAfter,
  addRowBefore,
  deleteRow,
  addColumnAfter,
  addColumnBefore,
  deleteColumn,
  mergeCells,
  splitCell,
  deleteTable,
  goToNextCell,
} from 'prosemirror-tables'

export class TableExtension extends Extension {
  readonly name = 'table'
  readonly priority = 500

  configure(): void {
    // Add table nodes
    const nodes = tableNodes({
      tableGroup: 'block',
      cellContent: 'block+',
      cellAttributes: {
        background: {
          default: null,
          getFromDOM(dom: HTMLElement) {
            return dom.style.backgroundColor || null
          },
          setDOMAttr(value: unknown, attrs: any) {
            if (typeof value === 'string' && value) {
              attrs.style = (attrs.style || '') + `background-color: ${value};`
            }
          },
        },
      },
    })

    this.addNode('table', nodes.table)
    this.addNode('table_row', nodes.table_row)
    this.addNode('table_cell', nodes.table_cell)
    this.addNode('table_header', nodes.table_header)

    // Add table editing plugins
    this.addPlugin(columnResizing())
    this.addPlugin(tableEditing())

    // Add table commands
    this.addCommand('insertTable', (state: any, dispatch?: any) => {
      const { schema } = state
      const table = schema.nodes.table.createAndFill()
      if (!table) return false
      
      const tr = state.tr.replaceSelectionWith(table)
      if (dispatch) dispatch(tr)
      return true
    })

    this.addCommand('addRowAfter', addRowAfter)
    this.addCommand('addRowBefore', addRowBefore)
    this.addCommand('deleteRow', deleteRow)
    this.addCommand('addColumnAfter', addColumnAfter)
    this.addCommand('addColumnBefore', addColumnBefore)
    this.addCommand('deleteColumn', deleteColumn)
    this.addCommand('mergeCells', mergeCells)
    this.addCommand('splitCell', splitCell)
    this.addCommand('deleteTable', deleteTable)

    // Add table keymap
    this.addKeymap('Tab', (state: any, dispatch?: any) => {
      return goToNextCell(1)(state, dispatch)
    })
    this.addKeymap('Shift-Tab', (state: any, dispatch?: any) => {
      return goToNextCell(-1)(state, dispatch)
    })
  }
}