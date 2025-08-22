/* eslint-disable @typescript-eslint/no-explicit-any */
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
  signal?: AbortSignal;
};

export const getLocations = async (
  params: GetLocationsParams = {}
): Promise<LocationsResponse> => {
  try {
    const { signal, ...requestParams } = params;

    const res = await apiClient.get('/location', {
      params: requestParams,
      signal,
    });

    const parsed = LocationsResponseSchema.safeParse(res.data);
    if (!parsed.success) {
      console.error('Failed to parse locations response', res.data);
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    return parsed.data;
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }

    if (err?.response?.status === 404) {
      return {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      };
    }
    throw err;
  }
};

export const getLocationById = async (
  id: number | string,
  signal?: AbortSignal
): Promise<Location | null> => {
  try {
    const res = await apiClient.get(`/location/${id}`, { signal });
    const parsed = LocationSchema.safeParse(res.data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }

    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const getLocationsByIds = async (
  ids: (number | string)[],
  signal?: AbortSignal
): Promise<Location[]> => {
  try {
    const res = await apiClient.get(`/location/${ids.join(',')}`, { signal });
    return Array.isArray(res.data)
      ? res.data.map((loc: unknown) => LocationSchema.parse(loc))
      : [LocationSchema.parse(res.data)];
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message === 'Request aborted') {
      throw new Error('Request aborted');
    }
    throw err;
  }
};

export const useGetLocations = (
  params: GetLocationsParams,
  options?: Omit<
    UseQueryOptions<LocationsResponse | null>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LocationsResponse | null>({
    queryKey: ['locations', params],
    queryFn: ({ signal }) => getLocations({ ...params, signal }),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useGetLocationById = (
  id: number | string,
  options?: Omit<UseQueryOptions<Location | null>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<Location | null>({
    queryKey: ['location', id],
    queryFn: ({ signal }) => getLocationById(id, signal),
    enabled: !!id,
    ...options,
  });
};

export const useGetLocationsByIds = (ids: (number | string)[]) => {
  return useQuery<Location[]>({
    queryKey: ['locations', ids],
    queryFn: ({ signal }) => getLocationsByIds(ids, signal),
    enabled: ids.length > 0,
  });
};
