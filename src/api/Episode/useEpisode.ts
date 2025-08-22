/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';
import {
  EpisodesResponse,
  EpisodesResponseSchema,
  Episode,
  EpisodeSchema,
} from '@/schema/EpisodeSchema';

export type GetEpisodesParams = {
  page?: number;
  name?: string;
  episode?: string;
};

export const getEpisodes = async (
  params: GetEpisodesParams = {}
): Promise<EpisodesResponse | null> => {
  try {
    const res = await apiClient.get('/episode', { params });
    const parsed = EpisodesResponseSchema.safeParse(res.data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const getEpisodeById = async (
  id: number | string
): Promise<Episode | null> => {
  try {
    const res = await apiClient.get(`/episode/${id}`);
    const parsed = EpisodeSchema.safeParse(res.data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const getEpisodesByIds = async (
  ids: (number | string)[]
): Promise<Episode[] | null> => {
  try {
    const res = await apiClient.get(`/episode/${ids.join(',')}`);
    if (Array.isArray(res.data)) {
      const parsed = res.data
        .map((ep: unknown) => {
          const result = EpisodeSchema.safeParse(ep);
          return result.success ? result.data : null;
        })
        .filter(Boolean) as Episode[];
      return parsed;
    } else {
      const parsed = EpisodeSchema.safeParse(res.data);
      return parsed.success ? [parsed.data] : null;
    }
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const useGetEpisodes = (
  params: GetEpisodesParams,
  options?: Omit<
    UseQueryOptions<EpisodesResponse | null>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<EpisodesResponse | null>({
    queryKey: ['episodes', params],
    queryFn: () => getEpisodes(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetEpisodeById = (
  id: number | string,
  options?: Omit<UseQueryOptions<Episode | null>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Episode | null>({
    queryKey: ['episode', id],
    queryFn: () => getEpisodeById(id),
    enabled: !!id,
    ...options,
  });
};

export const useGetEpisodesByIds = (
  ids: (number | string)[],
  options?: Omit<UseQueryOptions<Episode[] | null>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Episode[] | null>({
    queryKey: ['episodes', ids],
    queryFn: () => getEpisodesByIds(ids),
    enabled: ids.length > 0,
    ...options,
  });
};
