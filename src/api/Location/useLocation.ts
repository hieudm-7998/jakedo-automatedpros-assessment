import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

export type GetLocationsParams = {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
};

export const getLocations = async (params: GetLocationsParams = {}) => {
  const res = await apiClient.get('/location', { params });
  return res.data;
};

export const getLocationById = async (id: number | string) => {
  const res = await apiClient.get(`/location/${id}`);
  return res.data;
};

export const getLocationsByIds = async (ids: (number | string)[]) => {
  const res = await apiClient.get(`/location/${ids.join(',')}`);
  return res.data;
};

export const useGetLocations = (
  params: GetLocationsParams,
  options?: Partial<UseQueryOptions<any>>
) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => getLocations(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetLocationById = (id: number | string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
};

export const useGetLocationsByIds = (ids: (number | string)[]) => {
  return useQuery({
    queryKey: ['locations', ids],
    queryFn: () => getLocationsByIds(ids),
    enabled: ids.length > 0,
  });
};
