import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'node/cli': 'src/node/cli.ts',
    'client/register': 'src/client/register.ts',
  },
  format: ['esm'],
  dts: {
    compilerOptions: {
      incremental: false,
      module: 'esnext',
    },
  },
  outDir: 'lib-esm',
  splitting: false,
  sourcemap: false,
  clean: true,
  shims: true,
  platform: 'node',
  target: 'es2020',
  bundle: true,
  external: [
    'puppeteer-core',
    'storycrawler',
    'nanomatch',
    'yargs',
    'mkdirp',
    'rimraf',
    'sanitize-filename',
  ],
  esbuildOptions(options) {
    // CLI ファイルにのみ shebang を追加
    if (options.entryNames === '[dir]/[name]') {
      options.banner = {
        js: '#!/usr/bin/env node',
      };
    }
  },
  onSuccess: async () => {
    // CLI ファイルに実行権限を付与
    const { chmod } = await import('fs/promises');
    await chmod('lib-esm/node/cli.js', 0o755);
  },
});
