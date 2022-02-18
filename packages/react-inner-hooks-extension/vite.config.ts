import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // runtime: 'automatic',
      // development: process.env.NODE_ENV === 'development',
      // importSource: '@welldone-software/why-did-you-render',
      jsxRuntime: 'automatic',
      // jsxImportSource: 'react-inner-hooks-extension'
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'ReactInnerHooks',
      fileName: (format) => `react-inner-hooks-extension.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React'
        }
      }
    }
  }
})
