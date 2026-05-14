import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint . --ext .ts,.tsx',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});
