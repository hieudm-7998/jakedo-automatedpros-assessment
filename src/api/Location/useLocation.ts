import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';

export const getLocations = async (page?: number) => {
  const res = await apiClient.get('/location', { params: { page } });
  return res.data;
};

export const getLocationById = async (id: number | string) => {
  const res = await apiClient.get(`/location/${id}`);
  return res.data;
};

export const useGetLocations = (page?: number) => {
  return useQuery({
    queryKey: ['locations', page],
    queryFn: () => getLocations(page),
    placeholderData: keepPreviousData,
  });
};

export const useGetLocationById = (id: number | string) => {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
};
