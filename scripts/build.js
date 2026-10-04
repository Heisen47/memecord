import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

import fs from 'fs';

const projectRoot = resolve(import.meta.dirname, '..');

async function runBuild() {
  console.log('[0/2] Preparing WASM files (patching CORS credentials)...');

  // A. Patch bundled WASM factory for inline import in detector.ts
  const wasmSrc = resolve(projectRoot, 'node_modules/@mediapipe/tasks-vision/wasm/vision_wasm_internal.js');
  const wasmDest = resolve(projectRoot, 'src/gesture/vision_wasm_internal.mjs');
  if (fs.existsSync(wasmSrc)) {
    let wasmCode = fs.readFileSync(wasmSrc, 'utf8');
    // Emscripten defaults to credentials: "same-origin" which causes Chrome to throw TypeError / NetworkError
    // when fetching chrome-extension:// assets inside meet.google.com page context!
    wasmCode = wasmCode.replaceAll('credentials: "same-origin"', 'credentials: "omit"');
    if (!wasmCode.includes('export default ModuleFactory;')) {
      wasmCode += '\nexport default ModuleFactory;\n';
    }
    fs.writeFileSync(wasmDest, wasmCode);
  }

  // B. Patch the PUBLIC wasm loader JS files used by FilesetResolver.forVisionTasks()
  //    These get copied to dist/ as web_accessible_resources and loaded by MediaPipe at runtime
  const publicWasmDir = resolve(projectRoot, 'public/mediapipe/wasm');
  if (fs.existsSync(publicWasmDir)) {
    const jsFiles = fs.readdirSync(publicWasmDir).filter(f => f.endsWith('.js'));
    for (const jsFile of jsFiles) {
      const filePath = resolve(publicWasmDir, jsFile);
      let code = fs.readFileSync(filePath, 'utf8');
      if (code.includes('credentials: "same-origin"')) {
        code = code.replaceAll('credentials: "same-origin"', 'credentials: "omit"');
        fs.writeFileSync(filePath, code);
        console.log(`  Patched CORS credentials in public/mediapipe/wasm/${jsFile}`);
      }
    }
  }

  console.log('[1/2] Building Extension Pages and Background...');
  await build({
    root: projectRoot,
    plugins: [react()],
    build: {
      outDir: resolve(projectRoot, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(projectRoot, 'popup/index.html'),
          test: resolve(projectRoot, 'test/index.html'),
          background: resolve(projectRoot, 'src/background/index.ts')
        },
        output: {
          entryFileNames: (chunk) => {
            if (chunk.name === 'background') return 'background.js';
            return 'assets/[name]-[hash].js';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  });

  console.log('[2/2] Building Standalone IIFE Content Script...');
  await build({
    root: projectRoot,
    configFile: false,
    plugins: [react()],
    define: {
      'import.meta': '{}'
    },
    build: {
      outDir: resolve(projectRoot, 'dist'),
      emptyOutDir: false,
      rollupOptions: {
        input: {
          content: resolve(projectRoot, 'src/content/index.ts')
        },
        output: {
          format: 'iife',
          name: 'MemeMeetContentScript',
          entryFileNames: 'content.js',
          inlineDynamicImports: true
        }
      }
    }
  });

  console.log('Build completed successfully!');
}

runBuild().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
