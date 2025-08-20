import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

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
  return res.data;
};

export const getCharacterById = async (id: number | string) => {
  const res = await apiClient.get(`/character/${id}`);
  return res.data;
};

export const getCharactersByIds = async (ids: (number | string)[]) => {
  const res = await apiClient.get(`/character/${ids.join(',')}`);
  return res.data;
};

export const useGetCharacters = (
  params: GetCharactersParams,
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['characters', params],
    queryFn: () => getCharacters(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetCharactersByIds = (ids: (number | string)[]) => {
  return useQuery({
    queryKey: ['characters', ids],
    queryFn: () => getCharactersByIds(ids),
    enabled: ids.length > 0,
  });
};
