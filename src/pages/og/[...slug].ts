import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

// 1. Récupération des articles
const entries = await getCollection('blog');

// 2. Mapping : on associe "mon-article.png" à ses données
const pages = Object.fromEntries(entries.map(({ slug, data }) => [`${slug}.png`, { data }]));

// 3. Initialisation de la route
const route = await OGImageRoute({
  // IMPORTANT : Doit correspondre au mot dans les crochets du fichier ([...slug].ts)
  param: 'slug',

  pages: pages,

  getImageOptions: (_path, page) => ({
    title: page.data.title,
    description: page.data.description,
    
    // Ton Design
    bgGradient: [[24, 24, 27]],
    border: { color: [0, 112, 243], width: 20 },
    padding: 60,
    font: {
      title: {
        size: 80,
        families: ['Roboto', 'sans-serif'],
        weight: 'Bold',
        color: [255, 255, 255],
      },
      description: {
        size: 40,
        families: ['Roboto', 'sans-serif'],
        weight: 'Normal',
        color: [161, 161, 170],
        lineHeight: 1.4,
      },
    },
  }),
});

// 4. Exports explicites (C'est souvent là que l'export déstructuré échouait)
export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;