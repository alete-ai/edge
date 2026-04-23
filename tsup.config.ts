import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: false,
  minify: true,
  outDir: 'dist',
  treeshake: true,
  splitting: true,
  target: 'esnext',
  // Model assets are externalized to dist/model/ via postbuild
});
