import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

const cards = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cards' }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    slug: z.string(),
    hasMedia: z.boolean().default(false),
    mediaClass: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  articles,
  cards,
};