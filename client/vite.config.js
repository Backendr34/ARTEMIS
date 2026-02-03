import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Run the frontend on a new port to avoid collisions.
        port: 4100,
        strictPort: true,

        // Proxy API calls to the backend so the client can call `/api/...`
        // without hardcoding host/port and without CORS issues.
        proxy: {
            '/api': {
                // The backend runs on port 3001 — ensure the proxy points to it.
                target: 'http://localhost:3001',
                changeOrigin: true,
            },
        },
    },
})
