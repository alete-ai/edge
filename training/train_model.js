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
  return doc.tokens()
    .filter((t) => !t.out(its.stopWordFlag) && t.out(its.type) === 'word')
    .out(its.stem);
};

// We don't use nbc.definePrepTasks because we'll process manually 
// to have full control with wink-nlp.
nbc.defineConfig({
  considerOnlyPresence: true,
  smoothingFactor: 0.5
});

const datasetPath = path.join(__dirname, 'dataset.json');
const syntheticPath = path.join(__dirname, 'synthetic.json');
const weightsPath = path.join(__dirname, '../src/model/weights.json');

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
  'Other': 'Other:General'
};

console.log('Loading datasets...');
const xGenreData = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const syntheticData = JSON.parse(fs.readFileSync(syntheticPath, 'utf8'));

const allData = [
  ...xGenreData.map(d => ({ text: d.text, label: labelMap[d.label] || 'Other:General' })),
  ...syntheticData
];

console.log(`Training on ${allData.length} total samples...`);

let totalTokens = 0;
const labelStats = {};

allData.forEach((item, index) => {
  if (index % 500 === 0) console.log(`Processed ${index} samples...`);
  const tokens = preprocess(item.text);
  if (tokens.length > 0) {
    totalTokens += tokens.length;
    labelStats[item.label] = (labelStats[item.label] || 0) + 1;
    nbc.learn(tokens.join(' '), item.label);
  }
});

console.log(`Total tokens processed: ${totalTokens}`);
console.log('Label distribution:', JSON.stringify(labelStats, null, 2));

console.log('Consolidating model...');
nbc.consolidate();

// Check if consolidation actually worked by checking predictions on training data
const bankTest = preprocess("Bank Statement Checking Account Balance Transaction History");
console.log(`Prediction for Bank (Training Data): ${nbc.predict(bankTest.join(' '))}`);

const instrTest = preprocess("How to bake a cake. First, preheat the oven.");
console.log(`Prediction for Instruction (Training Data): ${nbc.predict(instrTest.join(' '))}`);

console.log('Exporting weights...');
const weights = nbc.exportJSON();

// Ensure the directory exists
const modelDir = path.dirname(weightsPath);
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}

fs.writeFileSync(weightsPath, weights);
console.log(`Model weights saved to ${weightsPath}`);

// Quick test
const testText = "How to bake a cake. First, preheat the oven to 350 degrees.";
const testTokens = preprocess(testText);
const prediction = nbc.predict(testTokens.join(' '));
console.log(`Test Prediction for 'Instruction': ${prediction}`);
