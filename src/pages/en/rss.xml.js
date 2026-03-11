import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog', ({ id }) => id.startsWith('en/'));
  
  return rss({
    title: 'Valentin Besse’s Blog',
    description: 'Tech thoughts, Astro, and legacy code explorations.',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // On génère le lien en nettoyant le slug
      link: `/en/blog/${post.slug.replace(/^en\//, '')}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}