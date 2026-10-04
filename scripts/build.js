import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const projectRoot = resolve(import.meta.dirname, '..');

async function runBuild() {
  console.log('[1/3] Building Extension Pages and Background...');
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

  console.log('[2/3] Building Standalone IIFE Content Script...');
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
          name: 'MemecordContentScript',
          entryFileNames: 'content.js',
          inlineDynamicImports: true
        }
      }
    }
  });

  console.log('[3/3] Building Standalone IIFE Camera Compositor Script (MAIN world)...');
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
          inject: resolve(projectRoot, 'src/content/inject.ts')
        },
        output: {
          format: 'iife',
          name: 'MemecordCameraInject',
          entryFileNames: 'inject.js',
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
