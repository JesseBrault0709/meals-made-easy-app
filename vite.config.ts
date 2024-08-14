import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), TanStackRouterVite(), checker({ typescript: true })],
    css: {
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    }
})
