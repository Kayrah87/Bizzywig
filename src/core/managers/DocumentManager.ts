import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { Manager } from '../types'
import { ViewStateManager } from './ViewStateManager'

export class DocumentManager implements Manager {
  private editorState: EditorState | null = null
  private editorView: EditorView | null = null
  private schema: Schema | null = null
  private viewStateManager: ViewStateManager

  constructor(viewStateManager: ViewStateManager) {
    this.viewStateManager = viewStateManager
  }

  initialize(): void {
    // Initialize document management
  }

  destroy(): void {
    if (this.editorView) {
      this.editorView.destroy()
      this.editorView = null
    }
    this.editorState = null
    this.schema = null
  }

  setSchema(schema: Schema): void {
    this.schema = schema
    this.initializeEditor()
  }

  getSchema(): Schema | null {
    return this.schema
  }

  private initializeEditor(): void {
    if (!this.schema) return

    this.editorState = EditorState.create({
      schema: this.schema,
    })
  }

  createEditorView(container: HTMLElement): EditorView {
    if (!this.editorState) {
      throw new Error('Editor state not initialized. Set schema first.')
    }

    this.editorView = new EditorView(container, {
      state: this.editorState,
      dispatchTransaction: (transaction: Transaction) => {
        this.handleTransaction(transaction)
      },
    })

    return this.editorView
  }

  private handleTransaction(transaction: Transaction): void {
    if (!this.editorState || !this.editorView) return

    const newState = this.editorState.apply(transaction)
    this.editorState = newState
    this.editorView.updateState(newState)

    // Notify view state manager of document changes
    if (transaction.docChanged) {
      this.viewStateManager.applyDocumentChange({
        type: 'content',
        data: {
          docSize: newState.doc.content.size,
        },
        timestamp: Date.now(),
      })
    }

    if (transaction.selectionSet) {
      this.viewStateManager.applyDocumentChange({
        type: 'selection',
        data: newState.selection.toJSON(),
        timestamp: Date.now(),
      })
    }
  }

  getEditorState(): EditorState | null {
    return this.editorState
  }

  getEditorView(): EditorView | null {
    return this.editorView
  }

  dispatchTransaction(transaction: Transaction): void {
    if (this.editorView) {
      this.editorView.dispatch(transaction)
    }
  }

  focus(): void {
    if (this.editorView) {
      this.editorView.focus()
    }
  }

  getContent(): any {
    return this.editorState?.doc.toJSON() || null
  }

  setContent(content: any): void {
    if (!this.editorState || !this.schema) return

    const doc = this.schema.nodeFromJSON(content)
    const newState = EditorState.create({
      doc,
      schema: this.schema,
    })

    if (this.editorView) {
      this.editorView.updateState(newState)
    }
    
    this.editorState = newState
  }
}