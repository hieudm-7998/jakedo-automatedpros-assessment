'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getLocations } from '@/api/Location/useLocation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import Loader from '@/components/LoadingIndicator';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Location } from '@/schema/LocationSchema';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const typesArray = [
  'Planet',
  'Cluster',
  'Space station',
  'Microverse',
  'TV',
  'Resort',
  'Fantasy town',
  'Dream',
  'Menagerie',
  'Game',
  'Customs',
  'Daycare',
  'Dwarf planet',
  'Miniverse',
  'Teenyverse',
  'Box',
  'Spacecraft',
  'Acid plant',
  'unknown',
];

const dimensionsArray = [
  'Dimension C-137',
  'unknown',
  'Post-Apocalyptic Dimension',
  'Replacement Dimension',
  'Cronenberg Dimension',
  'Fantasy Dimension',
  'Dimension 5-126',
  'Testicle Monster Dimension',
  'Dimension K-83',
  'Dimension J19ζ7',
  'Dimension C-500A',
  'Dimension C-500B',
];

export default function LocationInfiniteTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const urlName = searchParams.get('name') ?? '';
  const urlType = searchParams.get('type') ?? '';
  const urlDimension = searchParams.get('dimension') ?? '';

  const [name, setName] = useState(urlName);
  const [type, setType] = useState(urlType);
  const [dimension, setDimension] = useState(urlDimension);

  useEffect(() => {
    setName(urlName);
    setType(urlType);
    setDimension(urlDimension);
  }, [urlName, urlType, urlDimension]);

  const debouncedPush = useRef(
    debounce((filters: { name: string; type: string; dimension: string }) => {
      const params = new URLSearchParams();
      if (filters.name) params.set('name', filters.name);
      if (filters.type) params.set('type', filters.type);
      if (filters.dimension) params.set('dimension', filters.dimension);
      router.push(`?${params.toString()}`, { scroll: false });
    }, 300)
  ).current;

  const handleNameChange = (v: string) => {
    setName(v);
    debouncedPush({ name: v, type, dimension });
  };
  const handleTypeChange = (v: string) => {
    setType(v);
    debouncedPush({ name, type: v, dimension });
  };
  const handleDimensionChange = (v: string) => {
    setDimension(v);
    debouncedPush({ name, type, dimension: v });
  };

  const fetchLocationsWithAbort = useCallback(
    async ({ pageParam = 1 }) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const result = await getLocations({
          page: pageParam,
          name: urlName,
          type: urlType,
          dimension: urlDimension,
          signal: abortController.signal,
        });

        abortControllerRef.current = null;
        return result;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request aborted');
        }
        throw error;
      }
    },
    [urlName, urlType, urlDimension]
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['locations', urlName, urlType, urlDimension],
    queryFn: fetchLocationsWithAbort,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const nextUrl = lastPage.info?.next;
      if (!nextUrl) return undefined;
      const url = new URL(nextUrl);
      const nextPage = url.searchParams.get('page');
      return nextPage ? Number(nextPage) : undefined;
    },
    initialPageParam: 1,
  });

  const allLocations: Location[] = useMemo(
    () => data?.pages.flatMap((p) => p?.results ?? []) ?? [],
    [data]
  );

  const handleScroll = () => {
    const el = parentRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) fetchNextPage();
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3 max-h-[1000px] overflow-y-auto'
    >
      <h1 className='mb-6 py-10 font-bold text-3xl text-center'>
        All locations
      </h1>

      <div className='flex gap-4 mb-6'>
        <Input
          placeholder='Search by name'
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className='flex-1'
        />

        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger className='flex-1'>
            <SelectValue placeholder='Any Type' />
          </SelectTrigger>
          <SelectContent className='bg-white w-full max-w-80'>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              {typesArray.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={dimension} onValueChange={handleDimensionChange}>
          <SelectTrigger className='flex-1'>
            <SelectValue placeholder='Any Dimension' />
          </SelectTrigger>
          <SelectContent className='bg-white w-full max-w-80'>
            <SelectGroup>
              <SelectLabel>Dimension</SelectLabel>
              {dimensionsArray.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : isError ? (
        <div className='p-8 text-red-600 text-center'>
          Error loading locations
        </div>
      ) : allLocations.length === 0 ? (
        <div className='p-8 text-center'>No results found</div>
      ) : (
        <Table>
          <TableHeader className='top-0 z-10 sticky bg-[var(--main-color)]'>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dimension</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='text-right'>Favorite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLocations.map((loc) => (
              <TableRow
                key={loc.id}
                className='hover:bg-gray-200 transition-all cursor-pointer'
                onClick={() => router.push(`/locations/${loc.id}`)}
              >
                <TableCell className='font-medium'>{loc.name}</TableCell>
                <TableCell>{loc.type || '-'}</TableCell>
                <TableCell>{loc.dimension}</TableCell>
                <TableCell>{dayjs(loc.created).format('MM/DD/YYYY')}</TableCell>
                <TableCell className='text-right'>
                  <FavoriteButton id={loc.id} type='location' data={loc} />
                </TableCell>
              </TableRow>
            ))}
            {isFetchingNextPage && (
              <TableRow>
                <TableCell colSpan={5} className='py-4 text-center'>
                  <Loader size={20} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
