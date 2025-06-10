import { defineConfig } from 'vite'

export default defineConfig({
    base: '/consulta-cep/',
    build: {
        outDir: 'dist',
        sourcemap: true
    }
})