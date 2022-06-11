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
  resolve: {
    alias: {
      '@core': resolve(__dirname, './src'),
      '@types': resolve(__dirname, './types'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'zx-sml',
      fileName: (format) => `zx-sml.${format}.js`,
    },
  },
  plugins: [],
  test: {
    environment: 'jsdom',
  },
})
