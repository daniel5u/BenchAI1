import { defineCollection, z } from "astro:content";

const benchmarks = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    fullName: z.string().nullable(),
    publisher: z.string(),
    description: z.string(),
    link: z.string().url(),
    tags: z.array(z.string()),
    lastUpdated: z.string(),
    metrics: z.object({
      unit: z.string(),
      isBetterHigher: z.boolean().default(true),
    }),
    snapshot: z.array(z.object({
      model: z.string(),
      score: z.number(),
      publisher: z.string().optional()
    })),
    trending: z.object({
      views: z.number().default(0),
      initialWeight: z.number().default(0),
      score: z.number().default(0),
    }).optional(),
  }),
});

export const collections = {
  'benchmarks': benchmarks,
}