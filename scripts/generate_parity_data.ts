import { Model2VecEngine } from '../src/model2vec_engine.js';
import { ContentClassifier } from '../src/classifier.js';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  const engine = new Model2VecEngine();
  await engine.init();

  const samples = [
    "Hello world, this is a test of the Alete native classifier.",
    "Breaking News: New technology discovered in 2026 for edge computing.",
    "Login to your account to access the dashboard and manage your projects.",
    "The patient presented with symptoms of acute respiratory distress.",
    "Stock market crashes as global economy faces unprecedented challenges.",
    "This is a blog post about the future of AI and cognitive sovereignty.",
    "SELECT * FROM users WHERE id = 1; -- Just some code-like text.",
    "你好，这是一个中文测试。"
  ];

  const results = [];

  for (const text of samples) {
    const { input_ids } = await engine['tokenizer'](text);
    const result = await engine.classify(text);
    results.push({
      input: text,
      tokens: input_ids,
      label: result.label,
      score: result.score,
      all: result.all
    });
  }

  const outputPath = path.join(process.cwd(), 'ios/AleteClassifier/Tests/AleteClassifierTests/parity_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Generated ${results.length} parity samples to ${outputPath}`);
}

generate().catch(console.error);
