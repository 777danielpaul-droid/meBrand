#!/usr/bin/env node
/**
 * Remove black background from robot teardown PNG frames using Sharp.
 * The background is RGB(0,2,0) — near-black.
 * Pixels with luminance <= 15 → alpha=0 (transparent)
 * Pixels with luminance > 15 → alpha=255 (opaque)
 * This preserves dark robot parts (RGB ~50,50,51, luminance ~50 > 15).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.resolve(__dirname, '../public/anim/robot-teardown');
const OUTPUT_DIR = path.resolve(__dirname, '../public/anim/robot-teardown-transparent');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const frames = fs.readdirSync(INPUT_DIR)
  .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
  .sort();

console.log(`Found ${frames.length} frames`);

async function processFrame(file) {
  const inputPath = path.join(INPUT_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);
  
  // Use sharp's raw processing + custom alpha via linear-raw
  // Actually, sharp doesn't have a direct luminance threshold.
  // We'll use the { raw: ... } + pipeline approach.
  
  // Simplest approach: use sharp to extract raw pixels, threshold luminance, add alpha
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  
  const { width, height, channels } = info;
  // Create RGBA output: keep RGB, set alpha based on luminance
  const rgba = Buffer.alloc(width * height * 4);
  const LUMA_THRESHOLD = 15; // RGB(0,2,0) has luminance ~0; robot dark parts ~50
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    // Relative luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = lum > LUMA_THRESHOLD ? 255 : 0;
  }
  
  await sharp(rgba, {
    raw: { width, height, channels: 4 }
  }).png({ quality: 100, compressionLevel: 9 }).toFile(outputPath);
}

async function main() {
  // Test first frame
  console.log('Testing frame:', frames[0]);
  await processFrame(frames[0]);
  
  // Verify
  const { data, info } = await sharp(path.join(OUTPUT_DIR, frames[0])).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  
  const px = (x, y) => {
    const i = (y * width + x) * channels;
    return [data[i], data[i+1], data[i+2], channels > 3 ? data[i+3] : 255];
  };
  
  console.log('BG (0,0):', px(0, 0));
  console.log('CENTER (960,540):', px(960, 540));
  console.log('MID (900,400):', px(900, 400));
  
  const bgAlpha = px(0, 0)[3];
  const centerAlpha = px(960, 540)[3];
  const midAlpha = px(900, 400)[3];
  
  console.log(`\nBG alpha: ${bgAlpha} ${bgAlpha < 128 ? '✓ TRANSPARENT' : '✗ opaque'}`);
  console.log(`CENTER alpha: ${centerAlpha} ${centerAlpha > 128 ? '✓ opaque' : '✗ transparent'}`);
  console.log(`MID alpha: ${midAlpha} ${midAlpha > 128 ? '✓ opaque' : '✗ transparent'}`);
  
  if (bgAlpha < 128 && centerAlpha > 128 && midAlpha > 128) {
    console.log('\n✅ Threshold (15) works correctly! Processing all frames...');
    for (let i = 1; i < frames.length; i++) {
      await processFrame(frames[i]);
      if ((i + 1) % 50 === 0) console.log(`  Processed ${i + 1}/${frames.length}`);
    }
    console.log(`✅ Done! All ${frames.length} frames processed.`);
  } else {
    console.log('\n❌ Threshold needs adjustment. Not processing all frames.');
  }
}

main().catch(console.error);
