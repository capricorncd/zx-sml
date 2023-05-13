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
    outDir: resolve(__dirname, '../../dist/zx-sml'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'zxSml',
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    environment: 'jsdom',
  },
})