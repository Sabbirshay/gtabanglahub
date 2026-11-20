import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://gtabanglahub.com',
  output: 'static',
  build: { format: 'directory' },
  compressHTML: true,
});
