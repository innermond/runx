import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@error':path.resolve(__dirname, './src/error/'),
      '@lib':path.resolve(__dirname, './src/lib/'),
    },
  },
})
