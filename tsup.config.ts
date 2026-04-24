import { defineConfig } from 'tsup';

export default defineConfig([
  {
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
    noExternal: ['@huggingface/transformers', '@mozilla/readability', 'dom-to-semantic-markdown'],
    external: ['onnxruntime-node', 'fs', 'path', 'url', 'linkedom'],
    platform: 'node',
  },
  {
    entry: {
      'index.browser': 'src/index.ts'
    },
    format: ['esm'],
    dts: true,
    clean: false,
    sourcemap: false,
    minify: true,
    outDir: 'dist',
    treeshake: true,
    target: 'esnext',
    platform: 'browser',
    noExternal: ['@huggingface/transformers', '@mozilla/readability', 'dom-to-semantic-markdown', 'wink-nlp', 'wink-eng-lite-web-model', 'wink-naive-bayes-text-classifier'],
    external: ['linkedom', 'fs', 'path', 'url', 'onnxruntime-node'],
    // We shim linkedom and other node stuff to empty or native equivalents
    define: {
      'process.versions.node': 'undefined',
      'process.platform': '"browser"',
    },
    esbuildOptions(options) {
      options.alias = {
        'linkedom': 'src/platform/empty-shim.ts',
        'fs': 'src/platform/empty-shim.ts',
        'path': 'src/platform/empty-shim.ts',
        'url': 'src/platform/empty-shim.ts',
        'onnxruntime-node': 'onnxruntime-web'
      }
    }
  }
]);
