import { z } from 'zod';

export const CharacterSchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(['Alive', 'Dead', 'unknown']),
  species: z.string(),
  type: z.string(),
  gender: z.enum(['Female', 'Male', 'Genderless', 'unknown']),
  origin: z.object({
    name: z.string(),
    url: z.string(),
  }),
  location: z.object({
    name: z.string(),
    url: z.string(),
  }),
  image: z.string(),
  episode: z.array(z.string()),
  url: z.string(),
  created: z.iso.datetime(),
});

export const CharactersResponseSchema = z.object({
  info: z.object({
    count: z.number(),
    pages: z.number(),
    next: z.string().nullable(),
    prev: z.string().nullable(),
  }),
  results: z.array(CharacterSchema),
});

export type Character = z.infer<typeof CharacterSchema>;
export type CharactersResponse = z.infer<typeof CharactersResponseSchema>;
