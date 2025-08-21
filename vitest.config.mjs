import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'build', '.git', '**/__fixtures__/**'],
    setupFiles: ['tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/select.ts',
        'src/**/types.ts',
        'src/**/helpers.ts',
        'src/server.ts',
      ],
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
