import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import svgr from 'vite-plugin-svgr';
import vitetsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    vitetsConfigPaths(),
    commonjs(),
    svgr({
      include: ['src/**/*.svg'],
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      'react-infinite-scroller': 'react-infinite-scroller/index.js',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    outDir: 'build',
  },
  define: {
    global: 'globalThis',
  },
});
