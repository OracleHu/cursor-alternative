import { defineConfig } from 'electron-builder';

export default defineConfig({
  appId: 'com.cursor-alternative.app',
  productName: 'Cursor Alternative',
  directories: {
    output: 'release',
    buildResources: 'assets',
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json',
  ],
  win: {
    target: ['nsis', 'portable'],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
  mac: {
    target: ['dmg', 'zip'],
    category: 'public.app-category.developer-tools',
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Development',
  },
});
