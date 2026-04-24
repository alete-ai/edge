import { isNode } from './dom.js';

export interface AssetProvider {
  loadJson(pathOrUrl: string): Promise<any>
  loadBinary(pathOrUrl: string): Promise<ArrayBuffer>
  resolveUrl(fileName: string, modelPath?: string | null): string
}

export async function getAssetProvider(): Promise<AssetProvider> {
  if (isNode) {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');

    return {
      loadJson: async (p: string) => {
        return JSON.parse(fs.readFileSync(p, 'utf-8'));
      },
      loadBinary: async (p: string) => {
        const buffer = fs.readFileSync(p);
        return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      },
      resolveUrl: (fileName: string, modelPath?: string | null) => {
        if (modelPath && modelPath.startsWith('http')) return new URL(fileName, modelPath).href;
        
        let p: string;
        if (modelPath) {
          p = path.resolve(modelPath, fileName);
        } else {
          try {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            // 1. Try relative to this file (works in dist)
            p = path.resolve(__dirname, 'model', fileName);
            if (!fs.existsSync(p)) {
               // 2. Try sibling model folder
               p = path.resolve(__dirname, '..', 'model', fileName);
            }
            if (!fs.existsSync(p)) {
              // 3. Try src/model from project root (works in local tests)
              p = path.resolve(process.cwd(), 'src/model', fileName);
            }
          } catch (e) {
            p = path.resolve(process.cwd(), 'src/model', fileName);
          }
        }
        return p;
      }
    };
  } else {
    return {
      loadJson: async (url: string) => {
        const response = await fetch(url);
        return await response.json();
      },
      loadBinary: async (url: string) => {
        const response = await fetch(url);
        return await response.arrayBuffer();
      },
      resolveUrl: (fileName: string, modelPath?: string | null) => {
        if (modelPath && modelPath.startsWith('http')) {
          return modelPath.endsWith('/') ? `${modelPath}${fileName}` : `${modelPath}/${fileName}`;
        }

        const g = globalThis as any;
        if (g.chrome?.runtime?.getURL) {
          return g.chrome.runtime.getURL(`${modelPath || 'model'}/${fileName}`);
        }
        
        try {
          if (modelPath) return new URL(fileName, modelPath).href;
          return new URL(`./model/${fileName}`, import.meta.url).href;
        } catch (e) {
          const base = modelPath || '/model';
          return base.endsWith('/') ? `${base}${fileName}` : `${base}/${fileName}`;
        }
      }
    };
  }
}
