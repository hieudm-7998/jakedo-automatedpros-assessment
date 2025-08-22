import { z } from 'zod';

export const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
  characters: z.array(z.url()),
  url: z.url(),
  created: z.iso.datetime(),
});

export const EpisodesResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().url().nullable(),
    prev: z.string().url().nullable(),
  }),
  results: z.array(EpisodeSchema),
});

export type Episode = z.infer<typeof EpisodeSchema>;
export type EpisodesResponse = z.infer<typeof EpisodesResponseSchema>;
