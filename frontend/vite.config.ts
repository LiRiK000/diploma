import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        // TODO: Поменять на итоговое название
        name: 'Библиотека',
        // TODO: Поменять на итоговое название
        short_name: 'Библиотека',
        // TODO: Поменять на итоговое описание
        description: 'Сервис для поиска, заказа и получения книг из библиотеки',
        // TODO: Поменять на итоговый цвет шапки
        theme_color: '#ffffff',
        icons: [
          {
            // TODO: Поменять на итоговый иконку
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        start_url: '/',
        display: 'standalone',
        // TODO: Поменять на итоговый цвет шапки
        background_color: '#ffffff',
        orientation: 'portrait',
        scope: '/',
      },
    }),
  ],
})
