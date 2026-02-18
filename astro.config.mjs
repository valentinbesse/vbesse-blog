// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkReadingTime } from './src/utils/remark-reading-time.mjs';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://vbesse.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Choisis un thème sombre qui contraste bien
      // 'dracula', 'github-dark', 'one-dark-pro' sont tops
      theme: 'dracula',

      // ASTUCE PRO :
      // Si tu veux aller plus loin plus tard, Astro permet le double thème
      // themes: { light: 'github-light', dark: 'github-dark' },
    },
    // 2. Ajoute-le à la liste des plugins remark
    remarkPlugins: [remarkReadingTime],
  },
});