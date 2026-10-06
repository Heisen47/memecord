import { execSync } from 'child_process';
import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';

const projectRoot = resolve(import.meta.dirname, '..');
const distPath = resolve(projectRoot, 'dist');
const zipPath = resolve(projectRoot, 'memecord.zip');

console.log('[1/2] Building production extension...');
execSync('node scripts/build.js', { stdio: 'inherit', cwd: projectRoot });

console.log('[2/2] Packaging extension into memecord.zip for Chrome Web Store...');
if (existsSync(zipPath)) {
  unlinkSync(zipPath);
}

if (process.platform === 'win32') {
  execSync(`powershell -Command "Compress-Archive -Path '${distPath}/*' -DestinationPath '${zipPath}' -Force"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });
} else {
  execSync(`cd "${distPath}" && zip -r "${zipPath}" ./*`, {
    stdio: 'inherit',
    cwd: projectRoot
  });
}

console.log(`\nPackaged successfully: ${zipPath}`);
console.log('Ready to upload to Chrome Web Store Developer Dashboard!\n');
