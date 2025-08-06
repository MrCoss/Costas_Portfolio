import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Costas_Portfolio/', // required for GitHub Pages
  plugins: [react()]
})
