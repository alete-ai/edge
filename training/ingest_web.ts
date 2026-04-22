import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { AleteEdge } from '../src/index.js';
import { ExtractMode } from '../src/extractor.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const urlsPath = path.join(__dirname, 'urls.json');
const outputPath = path.join(__dirname, 'real_web_data.json');

const edge = new AleteEdge();

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
        
        // Use SIGNAL mode to capture structural markers for training
        const signalMarkdown = edge.extract(html, ExtractMode.SIGNAL);

        if (signalMarkdown && signalMarkdown.trim().length > 50) {
          allData.push({
            text: signalMarkdown,
            label: category,
            url: url,
            source: 'web_ingestion'
          });
          console.log(`    Success: ${signalMarkdown.length} chars`);
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
