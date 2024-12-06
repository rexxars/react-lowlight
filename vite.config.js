/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'demo',
  server: {
    port: 7777
  },
  build: {
    outDir: 'build'
  },
  plugins: [
    react()
  ],
  test: {
    root: '.'
  }
})
