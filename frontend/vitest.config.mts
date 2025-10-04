/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
  plugins: [react() as any],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup/vitest.setup.ts',
    include: ['src/**/*.{test,int.test,spec}.{ts,tsx}', 'app/**/*.{test,int.test,spec}.{ts,tsx}', 'components/**/*.{test,int.test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'tests/e2e'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts'],
    },
    alias: {
      '@': path.resolve(__dirname, './src'), // if you use @ imports
    },
  },
});
