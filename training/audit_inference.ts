import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AleteEdge } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetPath = path.join(__dirname, 'augmented_web_data.json');
const syntheticPath = path.join(__dirname, 'synthetic.json');
const xGenrePath = path.join(__dirname, 'dataset.json');

async function runAudit() {
  const modelType = (process.argv[2] || 'full') as 'full' | 'int8' | 'f16' | 'int4';
  
  console.log(`--- Alete-Edge: Neural Substrate Audit [Mode: ${modelType}] ---`);
  
  const edge = new AleteEdge({ modelType });
  
  console.log('Loading validation datasets...');
  const allData = [
    ...JSON.parse(fs.readFileSync(xGenrePath, 'utf8')).map((d: any) => ({ text: d.text, label: d.label })),
    ...JSON.parse(fs.readFileSync(syntheticPath, 'utf8')).map((d: any) => ({ text: d.text, label: d.label })),
    ...JSON.parse(fs.readFileSync(datasetPath, 'utf8'))
  ];

  // 90/10 split as in train_model.js
  const splitIndex = Math.floor(allData.length * 0.9);
  const valData = allData.slice(splitIndex);

  console.log(`Auditing ${valData.length} validation samples...`);

  let correct = 0;
  const metrics: Record<string, { total: number; correct: number }> = {};

  const start = Date.now();
  for (const item of valData) {
    // Process text for classification with metadata if available
    const prediction = await edge.classify(item.text);
    
    if (!metrics[item.label]) metrics[item.label] = { total: 0, correct: 0 };
    metrics[item.label].total++;

    if (prediction === item.label) {
      correct++;
      metrics[item.label].correct++;
    }
  }
  const duration = Date.now() - start;

  console.log('\n--- Results ---');
  console.log(`Overall Accuracy: ${((correct / valData.length) * 100).toFixed(2)}%`);
  console.log(`Inference Speed: ${(duration / valData.length).toFixed(2)}ms/sample`);
  
  console.log('\nPer-Label Accuracy:');
  Object.entries(metrics).sort().forEach(([label, stats]) => {
    const acc = ((stats.correct / stats.total) * 100).toFixed(2);
    console.log(`${label.padEnd(30)}: ${acc}% (${stats.correct}/${stats.total})`);
  });
}

runAudit().catch(console.error);
