/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';
import {
  CharactersResponse,
  CharactersResponseSchema,
  Character,
  CharacterSchema,
} from '@/schema/CharacterSchema';

export type GetCharactersParams = {
  page?: number;
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  signal?: AbortSignal;
};

export const getCharacters = async (
  params: GetCharactersParams = {}
): Promise<CharactersResponse> => {
  try {
    const { signal, ...requestParams } = params;

    const res = await apiClient.get('/character', {
      params: requestParams,
      signal,
    });

    return CharactersResponseSchema.parse(res.data);
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }
    throw err;
  }
};

export const getCharacterById = async (
  id: string | number,
  signal?: AbortSignal
): Promise<Character> => {
  try {
    const res = await apiClient.get(`/character/${id}`, { signal });
    const parsed = CharacterSchema.safeParse(res.data);
    if (!parsed.success) {
      throw new Error('Failed to parse character data');
    }
    return parsed.data;
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }

    if (err?.response?.status === 404) {
      throw new Error('Character not found');
    }
    throw err;
  }
};

export const getCharactersByIds = async (
  ids: (number | string)[],
  signal?: AbortSignal
): Promise<Character[]> => {
  try {
    const res = await apiClient.get(`/character/${ids.join(',')}`, { signal });
    return res.data.map((c: unknown) => CharacterSchema.parse(c));
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }
    throw err;
  }
};

export const useGetCharacters = (
  params: GetCharactersParams,
  options?: Omit<UseQueryOptions<CharactersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CharactersResponse>({
    queryKey: ['characters', params],
    queryFn: ({ signal }) => getCharacters({ ...params, signal }),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetCharacterById = (
  id: number | string,
  options?: Omit<UseQueryOptions<Character>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Character>({
    queryKey: ['character', id],
    queryFn: ({ signal }) => getCharacterById(id, signal),
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error.message === 'Character not found') return false;
      return failureCount < 3;
    },
    ...options,
  });
};

export const useGetCharactersByIds = (ids: (number | string)[]) => {
  return useQuery<Character[]>({
    queryKey: ['characters', ids],
    queryFn: ({ signal }) => getCharactersByIds(ids, signal),
    enabled: ids.length > 0,
  });
};
