import { Manager, ViewState, DocumentChange } from '../types'

export class ViewStateManager implements Manager {
  private state: ViewState
  private listeners: Array<(state: ViewState) => void> = []
  private changeHistory: DocumentChange[] = []

  constructor() {
    this.state = {
      documentVersion: 0,
      selection: null,
      scrollPosition: 0,
      activeExtensions: [],
    }
  }

  initialize(): void {
    // Initialize view state tracking
  }

  destroy(): void {
    this.listeners = []
    this.changeHistory = []
  }

  getState(): ViewState {
    return { ...this.state }
  }

  updateState(changes: Partial<ViewState>): void {
    const oldState = { ...this.state }
    this.state = { ...this.state, ...changes }
    
    // Record the change
    const change: DocumentChange = {
      type: 'content',
      data: { oldState, newState: this.state },
      timestamp: Date.now(),
    }
    this.changeHistory.push(change)
    
    // Notify listeners
    this.notifyListeners()
  }

  applyDocumentChange(change: DocumentChange): void {
    switch (change.type) {
      case 'content':
        this.state.documentVersion++
        break
      case 'selection':
        this.state.selection = change.data
        break
      case 'scroll':
        this.state.scrollPosition = change.data
        break
      case 'extension':
        this.handleExtensionChange(change.data)
        break
    }

    this.changeHistory.push(change)
    this.notifyListeners()
  }

  subscribe(listener: (state: ViewState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state))
  }

  private handleExtensionChange(data: any): void {
    if (data.action === 'activate' && !this.state.activeExtensions.includes(data.extension)) {
      this.state.activeExtensions.push(data.extension)
    } else if (data.action === 'deactivate') {
      const index = this.state.activeExtensions.indexOf(data.extension)
      if (index > -1) {
        this.state.activeExtensions.splice(index, 1)
      }
    }
  }

  getChangeHistory(): DocumentChange[] {
    return [...this.changeHistory]
  }

  clearHistory(): void {
    this.changeHistory = []
  }
}