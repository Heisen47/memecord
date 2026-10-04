import { execSync } from 'child_process';
import { resolve } from 'path';
import { existsSync, unlinkSync, statSync } from 'fs';

const projectRoot = resolve(import.meta.dirname, '..');
const distDir = resolve(projectRoot, 'dist');
const zipFile = resolve(projectRoot, 'memecord-extension.zip');

console.log('[Memecord Package] 1/3 Cleaning previous zip & metadata...');
if (existsSync(zipFile)) {
  unlinkSync(zipFile);
}

// Remove any .DS_Store or Mac metadata
try {
  execSync('find dist -name ".DS_Store" -delete', { cwd: projectRoot });
} catch (_) {}

console.log('[Memecord Package] 2/3 Compiling extension bundle...');
execSync('node scripts/build.js', { cwd: projectRoot, stdio: 'inherit' });

console.log('[Memecord Package] 3/3 Creating clean production zip archive for Chrome Web Store...');
// Use -X to strip Mac resource forks and extended attributes which cause Web Store warnings
execSync(`cd "${distDir}" && zip -r -X "${zipFile}" . -x "*.DS_Store*" -x "__MACOSX*"`, { stdio: 'inherit' });

const stats = statSync(zipFile);
console.log(`\n✅ Successfully generated Chrome Web Store bundle:`);
console.log(`   📦 File: memecord-extension.zip (${(stats.size / 1024).toFixed(1)} KB)`);
console.log(`   📍 Path: ${zipFile}`);
console.log(`   🚀 Ready to upload to Chrome Web Store Developer Dashboard!\n`);
