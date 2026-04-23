import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../src/model/m2v_embeddings.full.bin');
const f16Path = path.join(__dirname, '../src/model/m2v_embeddings.f16.bin');
const int8Path = path.join(__dirname, '../src/model/m2v_embeddings.int8.bin');
const int4Path = path.join(__dirname, '../src/model/m2v_embeddings.int4.bin');

// Metadata for quantization (needed to reconstruct float values)
const metaPath = path.join(__dirname, '../src/model/m2v_quant_meta.json');

async function quantize() {
  console.log('--- Substrate Condensation: Quantization ---');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Source ${inputPath} not found.`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(inputPath);
  const f32 = new Float32Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 4);
  console.log(`Source Substrate: ${f32.length} floats (~${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

  // Find global min/max for scaling
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < f32.length; i++) {
    if (f32[i] < min) min = f32[i];
    if (f32[i] > max) max = f32[i];
  }
  const range = max - min;

  // 1. Float16 Quantization
  console.log('Generating Float16 substrate...');
  const f16 = new Uint16Array(f32.length);
  for (let i = 0; i < f32.length; i++) {
    f16[i] = Math.floor(f32[i] * 1000) + 32768;
  }
  fs.writeFileSync(f16Path, Buffer.from(f16.buffer));
  console.log(`Created: ${f16Path} (~${(fs.statSync(f16Path).size / 1024 / 1024).toFixed(2)} MB)`);

  // 2. Int8 Quantization (Linear scaling)
  console.log('Generating Int8 substrate...');
  const i8 = new Int8Array(f32.length);
  const scale8 = 255 / range;
  for (let i = 0; i < f32.length; i++) {
    i8[i] = Math.round((f32[i] - min) * scale8) - 128;
  }
  fs.writeFileSync(int8Path, Buffer.from(i8.buffer));
  console.log(`Created: ${int8Path} (~${(fs.statSync(int8Path).size / 1024 / 1024).toFixed(2)} MB)`);

  // 3. Int4 Quantization (Aggressive Linear Scaling)
  console.log('Generating Int4 substrate...');
  const scale4 = 15 / range;
  // We pack two 4-bit values into one byte
  const i4Packed = new Uint8Array(Math.ceil(f32.length / 2));
  for (let i = 0; i < f32.length; i += 2) {
    const val1 = Math.round((f32[i] - min) * scale4); // 0-15
    const val2 = i + 1 < f32.length ? Math.round((f32[i + 1] - min) * scale4) : 0;
    i4Packed[i / 2] = (val1 << 4) | (val2 & 0x0F);
  }
  fs.writeFileSync(int4Path, Buffer.from(i4Packed.buffer));
  console.log(`Created: ${int4Path} (~${(fs.statSync(int4Path).size / 1024 / 1024).toFixed(2)} MB)`);

  fs.writeFileSync(metaPath, JSON.stringify({ 
    min, 
    max, 
    scale8, 
    scale4,
    count: f32.length 
  }));
  console.log(`Quantization metadata saved to: ${metaPath}`);
}

quantize().catch(console.error);
