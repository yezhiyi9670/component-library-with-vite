import { defineConfig } from 'vite'
import { resolve, extname, relative } from 'path'
import { glob } from 'glob'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    libInjectCss(),
    dts({ include: [
      "lib/**/*.ts", "lib/**/*.tsx", "lib/**/*.vue",
    ] }),
  ],
  build: {
    rollupOptions: {
      external: [ 'vue' ],
      input: Object.fromEntries(
        glob.sync('lib/**/*.{ts,tsx,vue}').map(file => [
          relative('lib', file.slice(0, file.length - extname(file).length)),
          resolve(__dirname, file)
        ])
      ),
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    },
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: [ 'es' ],
    },
    copyPublicDir: false,
  },
  resolve: {
    alias: {
      '@lib': resolve(__dirname, './lib/')
    }
  },
})
