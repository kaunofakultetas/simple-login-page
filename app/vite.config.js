import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
  plugins: [react(), appTitlePlugin()],
  server: {
    host: '0.0.0.0',
    port: 80,
  },
})
