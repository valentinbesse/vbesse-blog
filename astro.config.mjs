// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://vbesse.com',
  integrations: [mdx()],
  shikiConfig: {
      // Choisis un thème sombre qui contraste bien
      // 'dracula', 'github-dark', 'one-dark-pro' sont tops
      theme: 'dracula', 
      
      // ASTUCE PRO :
      // Si tu veux aller plus loin plus tard, Astro permet le double thème
      // themes: { light: 'github-light', dark: 'github-dark' },
    },
});