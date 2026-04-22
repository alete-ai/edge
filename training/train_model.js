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
const preprocess = (text, metadata) => {
  const doc = nlp.readDoc(text);
  const unigrams = doc.tokens()
    .filter((t) => !t.out(its.stopWordFlag) && (t.out(its.type) === 'word' || t.out() === '[' || t.out() === ']'))
    .out(its.stem);
  
  // Create bigrams
  const bigrams = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]}_${unigrams[i+1]}`);
  }

  // Create character bigrams for very short texts or specific tokens
  const charBigrams = [];
  unigrams.forEach(u => {
    if (u.length < 5) {
      for (let i = 0; i < u.length - 1; i++) {
        charBigrams.push(`c:${u[i]}${u[i+1]}`);
      }
    }
  });

  const tokens = [...unigrams, ...bigrams, ...charBigrams];
  
  // Add metadata tokens if available (Repeated 5x for weighting)
  if (metadata) {
    const metaTokens = [];
    if (metadata.buttonCount > 10) metaTokens.push('__btn_high');
    else if (metadata.buttonCount > 2) metaTokens.push('__btn_mid');
    else if (metadata.buttonCount > 0) metaTokens.push('__btn_low');

    if (metadata.linkCount > 50) metaTokens.push('__lnk_high');
    else if (metadata.linkCount > 10) metaTokens.push('__lnk_mid');
    else if (metadata.linkCount > 0) metaTokens.push('__lnk_low');

    if (metadata.linkToWordRatio > 0.3) metaTokens.push('__ratio_high');
    else if (metadata.linkToWordRatio > 0.1) metaTokens.push('__ratio_mid');
    
    if (metadata.imageCount > 10) metaTokens.push('__img_high');
    else if (metadata.imageCount > 0) metaTokens.push('__img_low');

    if (metadata.paragraphCount > 20) metaTokens.push('__para_high');
    else if (metadata.paragraphCount > 5) metaTokens.push('__para_mid');

    if (metadata.listCount > 5) metaTokens.push('__list_high');
    else if (metadata.listCount > 0) metaTokens.push('__list_low');

    for (let i = 0; i < 5; i++) {
      tokens.push(...metaTokens);
    }
  }

  return tokens;
};

nbc.defineConfig({
  considerOnlyPresence: true,
  smoothingFactor: 0.5
});

const datasetPath = path.join(__dirname, 'dataset.json');
const syntheticPath = path.join(__dirname, 'synthetic.json');
const realWebPath = path.join(__dirname, 'augmented_web_data.json');
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

// Pass 1: Frequency Analysis for Pruning
console.log('Pass 1: Analyzing token frequencies for pruning...');
const tokenFreq = new Map();
trainData.forEach((item) => {
  const tokens = preprocess(item.text, item.metadata);
  const uniqueTokens = new Set(tokens);
  uniqueTokens.forEach(t => {
    tokenFreq.set(t, (tokenFreq.get(t) || 0) + 1);
  });
});

const MAX_TOKENS = 20000;
const prunedTokens = new Set(
  Array.from(tokenFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_TOKENS)
    .map(entry => entry[0])
);
console.log(`Keeping top ${prunedTokens.size} tokens. Total tokens was ${tokenFreq.size}.`);

let totalTokens = 0;
const labelStats = {};

trainData.forEach((item, index) => {
  if (index % 1000 === 0) console.log(`Processed ${index} training samples...`);
  const tokens = preprocess(item.text, item.metadata).filter(t => prunedTokens.has(t));
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
  const tokens = preprocess(item.text, item.metadata);
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
let weights = JSON.parse(nbc.exportJSON());

// Optimization: Round large floats in weights if they exist to save JSON space
// Naive Bayes weights are typically token counts and log-probabilities.
// We'll keep them as is for now but minify the JSON.
fs.writeFileSync(weightsPath, JSON.stringify(weights));
console.log(`Model minified weights saved to ${weightsPath}`);
