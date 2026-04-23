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
  loader: {
    '.bin': 'dataurl',
  },
  // We remove publicDir because we want to bundle assets for zero-config npm usage
});
