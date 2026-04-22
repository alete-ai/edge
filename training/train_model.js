import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Classifier from 'wink-naive-bayes-text-classifier';
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nlp = winkNLP(model);
const its = nlp.its;

// Initialize the classifier
const nbc = Classifier();

// Define a simple identity prep task since we pre-process manually
nbc.definePrepTasks([
  (text) => text.split(' ')
]);

// Define pre-processing tasks using wink-nlp
const preprocess = (text) => {
  const doc = nlp.readDoc(text);
  const tokens = doc.tokens()
    .filter((t) => !t.out(its.stopWordFlag) && (t.out(its.type) === 'word' || t.out() === '[' || t.out() === ']'))
    .out(its.stem);
  return tokens;
};

nbc.defineConfig({
  considerOnlyPresence: true,
  smoothingFactor: 0.5
});

const datasetPath = path.join(__dirname, 'dataset.json');
const syntheticPath = path.join(__dirname, 'synthetic.json');
const realWebPath = path.join(__dirname, 'real_web_data.json');
const weightsPath = path.join(__dirname, '../src/model/weights.json');
const reportsDir = path.join(__dirname, 'reports');

// X-GENRE to Hierarchical Mapping
const labelMap = {
  'News': 'Informational:News',
  'Opinion/Argumentation': 'Informational:Blog',
  'Information/Explanation': 'Informational:Research',
  'Instruction': 'Educational:Instruction',
  'Forum': 'Social:Forum',
  'Promotion': 'Commercial:Promotion',
  'Prose/Lyrical': 'Creative:Prose',
  'Legal': 'Restricted:Legal',
  'Other': 'Other:General',
  'Functional:App': 'Functional:App',
  'Restricted:Financial': 'Restricted:Financial',
  'Restricted:Health': 'Restricted:Health',
  'Restricted:PII': 'Restricted:PII'
};

console.log('Loading datasets...');
const xGenreData = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const syntheticData = JSON.parse(fs.readFileSync(syntheticPath, 'utf8'));
const realWebData = fs.existsSync(realWebPath) ? JSON.parse(fs.readFileSync(realWebPath, 'utf8')) : [];

let allData = [
  ...xGenreData.map(d => ({ text: d.text, label: labelMap[d.label] || 'Other:General' })),
  ...syntheticData.map(d => ({ text: d.text, label: labelMap[d.label] || d.label })),
  ...realWebData
];

// Shuffle data
allData = allData.sort(() => Math.random() - 0.5);

// Split data (90% train, 10% validation)
const splitIndex = Math.floor(allData.length * 0.9);
const trainData = allData.slice(0, splitIndex);
const valData = allData.slice(splitIndex);

console.log(`Training on ${trainData.length} samples, validating on ${valData.length}...`);

let totalTokens = 0;
const labelStats = {};

trainData.forEach((item, index) => {
  if (index % 1000 === 0) console.log(`Processed ${index} training samples...`);
  const tokens = preprocess(item.text);
  if (tokens.length > 0) {
    totalTokens += tokens.length;
    labelStats[item.label] = (labelStats[item.label] || 0) + 1;
    nbc.learn(tokens.join(' '), item.label);
  }
});

console.log('Consolidating model...');
nbc.consolidate();

// Validation
console.log('Running validation...');
let correct = 0;
const perLabelMetrics = {};

valData.forEach(item => {
  const tokens = preprocess(item.text);
  if (tokens.length > 0) {
    const prediction = nbc.predict(tokens.join(' '));
    if (!perLabelMetrics[item.label]) perLabelMetrics[item.label] = { total: 0, correct: 0 };
    perLabelMetrics[item.label].total++;
    
    if (prediction === item.label) {
      correct++;
      perLabelMetrics[item.label].correct++;
    }
  }
});

const perLabelAccuracyWithPercent = {};
for (const [label, stats] of Object.entries(perLabelMetrics)) {
  perLabelAccuracyWithPercent[label] = {
    ...stats,
    accuracy: ((stats.correct / stats.total) * 100).toFixed(2) + '%'
  };
}

const sourceStats = {};
allData.forEach(d => {
  const source = d.source || (d.text.includes('[') ? 'synthetic' : 'x-genre');
  sourceStats[source] = (sourceStats[source] || 0) + 1;
});

const accuracy = (correct / valData.length) * 100;
console.log(`Validation Accuracy: ${accuracy.toFixed(2)}%`);

// Prepare Audit Report
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const report = {
  timestamp: new Date().toISOString(),
  dataSources: sourceStats,
  totalSamples: allData.length,
  trainSamples: trainData.length,
  valSamples: valData.length,
  totalTokens,
  overallAccuracy: accuracy.toFixed(2) + '%',
  labelDistribution: labelStats,
  perLabelAccuracy: perLabelAccuracyWithPercent,
  config: {
    smoothingFactor: 0.5,
    considerOnlyPresence: true,
    preprocessing: "wink-nlp stem + preserve brackets []"
  }
};

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
const reportPath = path.join(reportsDir, `run_${timestamp}.json`);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Audit report saved to ${reportPath}`);

// Export weights
console.log('Exporting weights...');
const weights = nbc.exportJSON();
fs.writeFileSync(weightsPath, weights);
console.log(`Model weights saved to ${weightsPath}`);
