import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

const benchmarks = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/benchmarks" }),
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
      modelRef: z.string(),
      score: z.number(),
    })),
    trending: z.object({
      views: z.number().default(0),
      initialWeight: z.number().default(0),
    }).optional(),
    isFromAA: z.boolean().optional(),
    AALink: z.string().optional(),
  }),
});

const models = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/models" }),
  schema: z.object({
    name: z.string(),
    publisher: z.string(),
    releaseDate: z.string().optional(),
    params: z.string().optional(),
    license: z.string().optional(),
    website: z.string().optional(),
    discussionId: z.string().optional()
  })
});

const publishers = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/publishers" }),
  schema: z.object({
    "name": z.string(),
    "color": z.string(),
    "logo": z.string(),
    "website": z.string().optional()
  })
});

export const collections = {
  'benchmarks': benchmarks,
  'models': models,
  'publishers': publishers,
}
