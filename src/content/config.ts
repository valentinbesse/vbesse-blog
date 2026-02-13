// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.string(),
		image: image().optional(),
        imageAlt: z.string().optional(),
        imageCaption: z.string().optional(),
        aiDisclaimer: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = {
	'blog': blogCollection,
};