import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Bizzywig, DefaultExtension, TableExtension, FontExtension } from '../index'

describe('Bizzywig Core', () => {
  let bizzywig: Bizzywig

  beforeEach(async () => {
    bizzywig = new Bizzywig()
    await bizzywig.initialize()
  })

  afterEach(() => {
    bizzywig.destroy()
  })

  it('should initialize successfully', () => {
    expect(bizzywig.isInitialized()).toBe(true)
  })

  it('should manage extensions', () => {
    const defaultExt = new DefaultExtension()
    defaultExt.configure()
    
    bizzywig.extensions.register(defaultExt.getConfig())
    expect(bizzywig.extensions.getRegistered()).toContain('default')
    
    bizzywig.extensions.activate('default')
    expect(bizzywig.extensions.isActive('default')).toBe(true)
    
    bizzywig.extensions.deactivate('default')
    expect(bizzywig.extensions.isActive('default')).toBe(false)
  })

  it('should manage menu tabs and sections', () => {
    bizzywig.menu.registerTab({
      id: 'test-tab',
      title: 'Test Tab',
      sections: []
    })
    
    const tab = bizzywig.menu.getTab('test-tab')
    expect(tab).toBeDefined()
    expect(tab?.title).toBe('Test Tab')
    
    bizzywig.menu.registerSection('test-tab', {
      id: 'test-section',
      title: 'Test Section',
      items: []
    })
    
    const section = bizzywig.menu.getSection('test-section')
    expect(section).toBeDefined()
    expect(section?.title).toBe('Test Section')
  })

  it('should track view state changes', () => {
    const initialState = bizzywig.viewState.getState()
    expect(initialState.documentVersion).toBe(0)
    
    bizzywig.viewState.applyDocumentChange({
      type: 'content',
      data: { test: 'data' },
      timestamp: Date.now()
    })
    
    const updatedState = bizzywig.viewState.getState()
    expect(updatedState.documentVersion).toBe(1)
  })

  it('should register and manage plugins', () => {
    const mockPlugin: any = { key: 'test-plugin' }
    
    bizzywig.plugins.register('test-plugin', mockPlugin)
    expect(bizzywig.plugins.getRegisteredNames()).toContain('test-plugin')
    
    bizzywig.plugins.activate('test-plugin')
    expect(bizzywig.plugins.isActive('test-plugin')).toBe(true)
  })
})

describe('Extensions', () => {
  it('should configure DefaultExtension correctly', () => {
    const ext = new DefaultExtension()
    ext.configure()
    
    const config = ext.getConfig()
    expect(config.name).toBe('default')
    expect(config.priority).toBe(1000)
    expect(config.schema?.nodes).toBeDefined()
    expect(config.schema?.marks).toBeDefined()
    expect(config.commands).toBeDefined()
  })

  it('should configure TableExtension correctly', () => {
    const ext = new TableExtension()
    ext.configure()
    
    const config = ext.getConfig()
    expect(config.name).toBe('table')
    expect(config.priority).toBe(500)
    expect(config.schema?.nodes).toBeDefined()
    expect(config.commands).toBeDefined()
  })

  it('should configure FontExtension correctly', () => {
    const ext = new FontExtension()
    ext.configure()
    
    const config = ext.getConfig()
    expect(config.name).toBe('font')
    expect(config.priority).toBe(300)
    expect(config.schema?.marks).toBeDefined()
    expect(config.commands).toBeDefined()
  })
})