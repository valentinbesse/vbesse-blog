import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // 1. On récupère tous les articles de blog
  const posts = await getCollection('blog');

  // 2. On renvoie le flux XML
  return rss({
    // Le titre de ton flux (visible dans le lecteur RSS)
    title: 'Le Blog de Valentin Besse',
    description: 'Tech, Web Development, Astro & Legacy Code.',
    site: context.site,
    
    // 3. On mappe tes articles
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Génère le lien vers l'article (ex: /blog/mon-article/)
      link: `/blog/${post.slug}/`,
    })),
    
    // (Optionnel) Ajoute la langue
    customData: `<language>fr-fr</language>`,
  });
}