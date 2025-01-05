import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import WindiCSS from 'vite-plugin-windicss';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      overlay: true,
    },
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(
              `Proxying request: ${req.method} ${req.url} -> ${options.target}${req.url}`,
            );
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(
              `Proxying request: ${req.method} ${req.url} -> ${options.target}${req.url}`,
            );
          });
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err);
          });
        },
      },
    },
  },
  plugins: [react(), WindiCSS()],
});
