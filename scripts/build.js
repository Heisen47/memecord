import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const projectRoot = resolve(import.meta.dirname, '..');

async function runBuild() {
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
