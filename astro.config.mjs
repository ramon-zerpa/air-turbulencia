import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.airturbulencia.com',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  devToolbar: { enabled: false },
});
