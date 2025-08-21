import { z } from 'zod';

export const LocationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  dimension: z.string(),
  residents: z.array(z.string()),
  url: z.string(),
  created: z.iso.datetime(),
});

export const LocationsResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().nullable(),
    prev: z.string().nullable(),
  }),
  results: z.array(LocationSchema),
});

export type Location = z.infer<typeof LocationSchema>;
export type LocationsResponse = z.infer<typeof LocationsResponseSchema>;
