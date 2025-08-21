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
  status?: 'alive' | 'dead' | 'unknown';
  species?: string;
  type?: string;
  gender?: 'female' | 'male' | 'genderless' | 'unknown';
};

export const getCharacters = async (params: GetCharactersParams = {}) => {
  const res = await apiClient.get('/character', { params });
  return CharactersResponseSchema.parse(res.data);
};

export const getCharacterById = async (
  id: number | string
): Promise<Character> => {
  const res = await apiClient.get(`/character/${id}`);
  return CharacterSchema.parse(res.data);
};

export const getCharactersByIds = async (
  ids: (number | string)[]
): Promise<Character[]> => {
  const res = await apiClient.get(`/character/${ids.join(',')}`);
  return res.data.map((c: unknown) => CharacterSchema.parse(c));
};

export const useGetCharacters = (
  params: GetCharactersParams,
  options?: Omit<UseQueryOptions<CharactersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CharactersResponse>({
    queryKey: ['characters', params],
    queryFn: () => getCharacters(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetCharacterById = (id: number | string) => {
  return useQuery<Character>({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
    enabled: !!id,
  });
};

export const useGetCharactersByIds = (ids: (number | string)[]) => {
  return useQuery<Character[]>({
    queryKey: ['characters', ids],
    queryFn: () => getCharactersByIds(ids),
    enabled: ids.length > 0,
  });
};
