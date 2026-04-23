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
  noExternal: ['@huggingface/transformers'],
  external: ['onnxruntime-node', 'fs', 'path', 'url'],
  // Model assets are externalized to dist/model/ via postbuild
});
