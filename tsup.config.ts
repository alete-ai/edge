import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  outDir: 'dist',
  treeshake: true,
  splitting: true,
  target: 'esnext',
  // Ensure weights.json is bundled appropriately.
  // Esbuild (used by tsup) will bundle it by default when imported.
});
