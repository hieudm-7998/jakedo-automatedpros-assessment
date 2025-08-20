import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

export type GetEpisodesParams = {
  page?: number;
  name?: string;
  episode?: string; // S01E01 format
};

export const getEpisodes = async (params: GetEpisodesParams = {}) => {
  const res = await apiClient.get('/episode', { params });
  return res.data;
};

export const getEpisodeById = async (id: number | string) => {
  const res = await apiClient.get(`/episode/${id}`);
  return res.data;
};

export const getEpisodesByIds = async (ids: (number | string)[]) => {
  const res = await apiClient.get(`/episode/${ids.join(',')}`);
  return res.data;
};

export const useGetEpisodes = (
  params: GetEpisodesParams,
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['episodes', params],
    queryFn: () => getEpisodes(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetEpisodeById = (id: number | string) => {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => getEpisodeById(id),
    enabled: !!id,
  });
};

export const useGetEpisodesByIds = (ids: (number | string)[]) => {
  return useQuery({
    queryKey: ['episodes', ids],
    queryFn: () => getEpisodesByIds(ids),
    enabled: ids.length > 0,
  });
};
