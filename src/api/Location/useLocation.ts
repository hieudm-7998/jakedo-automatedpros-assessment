import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/api/ApiClient';
import {
  Location,
  LocationSchema,
  LocationsResponse,
  LocationsResponseSchema,
} from '@/schema/LocationSchema';

export type GetLocationsParams = {
  page?: number;
  name?: string;
  type?: string;
  dimension?: string;
};

export const getLocations = async (
  params: GetLocationsParams = {}
): Promise<LocationsResponse> => {
  const res = await apiClient.get('/location', { params });
  return LocationsResponseSchema.parse(res.data);
};

export const getLocationById = async (
  id: number | string
): Promise<Location> => {
  const res = await apiClient.get(`/location/${id}`);
  return LocationSchema.parse(res.data);
};

export const getLocationsByIds = async (
  ids: (number | string)[]
): Promise<Location[]> => {
  const res = await apiClient.get(`/location/${ids.join(',')}`);
  return Array.isArray(res.data)
    ? res.data.map((loc: unknown) => LocationSchema.parse(loc))
    : [LocationSchema.parse(res.data)];
};

export const useGetLocations = (
  params: GetLocationsParams,
  options?: Omit<UseQueryOptions<LocationsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<LocationsResponse>({
    queryKey: ['locations', params],
    queryFn: () => getLocations(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetLocationById = (id: number | string) => {
  return useQuery<Location>({
    queryKey: ['location', id],
    queryFn: () => getLocationById(id),
    enabled: !!id,
  });
};

export const useGetLocationsByIds = (ids: (number | string)[]) => {
  return useQuery<Location[]>({
    queryKey: ['locations', ids],
    queryFn: () => getLocationsByIds(ids),
    enabled: ids.length > 0,
  });
};
