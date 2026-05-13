import { defineConfig } from 'tsup';
import path from 'path';

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
    external: ['onnxruntime-node', 'fs', 'path', 'url', 'linkedom', '@alete-ai/edge-core'],
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
    noExternal: [
      '@alete-ai/edge-core',
      '@mozilla/readability', 
      'dom-to-semantic-markdown', 
      'wink-nlp', 
      'wink-eng-lite-web-model', 
      'wink-naive-bayes-text-classifier'
    ],
    external: ['linkedom', 'fs', 'path', 'url', 'onnxruntime-node'],
    define: {
      'process.versions.node': 'undefined',
      'process.platform': '"browser"',
    },
    esbuildOptions(options) {
      options.alias = {
        'linkedom': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'fs': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'path': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'url': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'crypto': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'os': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'stream': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
        'worker_threads': path.resolve(__dirname, '../edge-core/src/platform/empty-shim.ts'),
      }
    }
  }
]);
