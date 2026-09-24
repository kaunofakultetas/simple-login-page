// -----------------------------------------------------------
//  [*] Vite configuration
//
//  Plugins:
//    - react (SWC)    — JSX + fast refresh
//    - tailwindcss    — Tailwind v4 (no tailwind.config file)
//    - appTitlePlugin — dev-only mirror of the production
//      /app/title endpoint (Caddyfile), so LoginForm's title
//      fetch works under the dev server too
//
//  Dev server on 0.0.0.0:80 so the Docker dev container
//  (Dockerfile.dev) is reachable from outside.
// -----------------------------------------------------------

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'








// -----------------------------------------------------------
// appTitlePlugin
// -----------------------------------------------------------
//
// In production Caddy answers GET /app/title with the
// VITE_SYSTEM_NAME env var (Caddyfile). The dev server has no
// Caddy in front, so this middleware answers the same route
// the same way — <br/> separators and all.
//
// Used by:
//   - the plugins list below (dev server only; build output
//     is untouched)
// -----------------------------------------------------------

function appTitlePlugin() {
  return {
    name: 'app-title',
    configureServer(server) {
      server.middlewares.use('/app/title', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain')
        res.end(process.env.VITE_SYSTEM_NAME || '')
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), appTitlePlugin()],
  server: {
    host: '0.0.0.0',
    port: 80,
  },
})
