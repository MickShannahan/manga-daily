import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    // SPA fallback: serve index.html for any route that isn't a static asset.
    // Needed because the reactRouter() plugin doesn't configure Vite's dev server
    // to fall back to index.html for dynamic routes when ssr: false.
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url ?? '/'
            if (!url.match(/\.\w+(\?.*)?$/) && !url.startsWith('/@') && !url.startsWith('/node_modules')) {
              try {
                const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf-8')
                const html = await server.transformIndexHtml(url, indexHtml)
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.statusCode = 200
                res.end(html)
              } catch {
                next()
              }
            } else {
              next()
            }
          })
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080
  },
})
