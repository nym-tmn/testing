///<reference types="vitest"/>
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,  // Глобальные переменные Vitest (аналог jest)
		environment: 'jsdom',  // Для тестирования React-компонентов
		setupFiles: './src/test/setup.ts',  // Файл с настройками (опционально)
	},
})

/* import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,  // Глобальные переменные Vitest (аналог jest)
    environment: 'jsdom',  // Для тестирования React-компонентов
    setupFiles: './src/test/setup.ts',  // Файл с настройками (опционально)
  },
}); */
