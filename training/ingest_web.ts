import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { Extractor, ExtractMode } from '../src/extractor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const urlsPath = path.join(__dirname, 'urls.json');
const outputPath = path.join(__dirname, 'real_web_data.json');

const extractor = new Extractor();

async function ingest() {
  const categories = JSON.parse(fs.readFileSync(urlsPath, 'utf8'));
  const allData: any[] = [];

  for (const [category, urls] of Object.entries(categories)) {
    console.log(`Processing category: ${category}`);
    for (const url of urls as string[]) {
      try {
        console.log(`  Fetching: ${url}`);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          timeout: 10000
        });

        if (!response.ok) {
          console.warn(`    Failed to fetch ${url}: ${response.statusText}`);
          continue;
        }

        const html = await response.text();
        
        // Use STRUCTURAL mode to capture structural metadata for training
        const result = extractor.extractWithMetadata(html, ExtractMode.STRUCTURAL);

        if (result && result.markdown && result.markdown.trim().length > 50) {
          allData.push({
            text: result.markdown,
            label: category,
            url: url,
            metadata: result.metadata,
            source: 'web_ingestion'
          });
          console.log(`    Success: ${result.markdown.length} chars`);
        } else {
          console.warn(`    Empty or too short extraction for ${url}`);
        }
      } catch (error: any) {
        console.error(`    Error processing ${url}: ${error.message}`);
      }
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`\nFinished! Ingested ${allData.length} real-world samples to ${outputPath}`);
}

ingest().catch(console.error);
