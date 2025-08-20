import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

export const getEpisodes = async (page?: number) => {
  const res = await apiClient.get('/episode', { params: { page } });
  return res.data;
};

export const getEpisodeById = async (id: number | string) => {
  const res = await apiClient.get(`/episode/${id}`);
  return res.data;
};

export const useGetEpisodes = (page?: number) => {
  return useQuery({
    queryKey: ['episodes', page],
    queryFn: () => getEpisodes(page),
    placeholderData: keepPreviousData,
  });
};

export const useGetEpisodeById = (id: number | string) => {
  return useQuery({
    queryKey: ['episode', id],
    queryFn: () => getEpisodeById(id),
    enabled: !!id,
  });
};
