import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      types: 'src/types.ts',
      'platform/assets': 'src/platform/assets.ts',
      'platform/dom': 'src/platform/dom.ts',
      'platform/tokenizer': 'src/platform/tokenizer.ts',
      'platform/empty-shim': 'src/platform/empty-shim.ts'
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: false,
    minify: true,
    outDir: 'dist',
    treeshake: true,
    splitting: true,
    target: 'esnext',
    noExternal: ['@mozilla/readability', 'dom-to-semantic-markdown'],
    external: ['linkedom', 'fs', 'path', 'url'],
    platform: 'node',
  }
]);
