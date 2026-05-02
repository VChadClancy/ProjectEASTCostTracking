import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/__tests__/*.ts'],
    setupFiles: ['./src/routes/__tests__/vitest.setup.ts'],
  },
});
