import { keepPreviousData, useQuery } from '@tanstack/react-query';
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

export const useGetCharacters = (params: GetCharactersParams) => {
  return useQuery({
    queryKey: ['characters', params],
    queryFn: () => getCharacters(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetCharacterById = (id: number | string) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacterById(id),
    enabled: !!id,
  });
};
