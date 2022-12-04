import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: true,             // I have no idea why, but this option is necessary for playwright (v1.28.1) to run tests with firefox and webkit
        strictPort: true,
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            },
            "/files": {
                target: "http://localhost:5000",
                changeOrigin: true,
            }
        }
    }, 
    build: {
        outDir: "build"
    },
    resolve: {
        alias: [
            { find: "src", replacement: path.resolve(__dirname, "src") } 
        ]
    }
})
