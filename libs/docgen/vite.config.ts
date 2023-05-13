/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2022/06/11 09:54:35 (GMT+0900)
 */
/// <reference types="vitest" />
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: resolve(__dirname, '../../dist/zx-docgen'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'zxDocgen',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['node:fs', 'node:path', 'node:os'],
    },
  },
  test: {
    environment: 'jsdom',
  },
})