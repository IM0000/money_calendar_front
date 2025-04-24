/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const isDev = mode === 'development';

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: isDev
      ? {
          hmr: {
            overlay: true,
          },
          proxy: {
            '/api': {
              target: env.VITE_BACKEND_URL,
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
        }
      : undefined,
    plugins: [react()],
  };
});
