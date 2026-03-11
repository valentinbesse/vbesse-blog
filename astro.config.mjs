// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vbesse.com',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false, // Ne rajoute pas /fr/ aux URLs existantes
    },
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Thème sombre qui contraste bien
      theme: 'dracula',
    },
    remarkPlugins: [remarkReadingTime],
  },
});