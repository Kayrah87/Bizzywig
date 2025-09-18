import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Bizzywig',
      formats: ['es', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'prosemirror-commands',
        'prosemirror-keymap',
        'prosemirror-model',
        'prosemirror-schema-basic',
        'prosemirror-schema-list',
        'prosemirror-state',
        'prosemirror-tables',
        'prosemirror-transform',
        'prosemirror-view',
      ],
      output: {
        globals: {
          'prosemirror-commands': 'prosemirrorCommands',
          'prosemirror-keymap': 'prosemirrorKeymap',
          'prosemirror-model': 'prosemirrorModel',
          'prosemirror-schema-basic': 'prosemirrorSchemaBasic',
          'prosemirror-schema-list': 'prosemirrorSchemaList',
          'prosemirror-state': 'prosemirrorState',
          'prosemirror-tables': 'prosemirrorTables',
          'prosemirror-transform': 'prosemirrorTransform',
          'prosemirror-view': 'prosemirrorView',
        },
      },
    },
  },
})