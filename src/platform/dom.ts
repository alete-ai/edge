export interface DOMProvider {
  parseHTML(html: string): { document: any }
  createParser(): any
}

export const isNode = typeof process !== 'undefined' && process.versions?.node;

export async function getDOMProvider(): Promise<DOMProvider> {
  if (isNode) {
    const { parseHTML, DOMParser } = await import('linkedom');
    return {
      parseHTML: (html: string) => parseHTML(html),
      createParser: () => new DOMParser()
    };
  } else {
    return {
      parseHTML: (html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return { document: doc };
      },
      createParser: () => new DOMParser()
    };
  }
}
