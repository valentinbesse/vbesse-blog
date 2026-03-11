import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  // On ne prend que le FR
  const blog = await getCollection('blog', ({ id }) => id.startsWith('fr/'));
  
  return rss({
    title: 'Le Blog de Valentin Besse',
    description: 'Code, Astro et réflexions tech.',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // On génère le lien sans le préfixe fr/
      link: `/blog/${post.slug.replace(/^fr\//, '')}/`,
    })),
    customData: `<language>fr-fr</language>`,
  });
}