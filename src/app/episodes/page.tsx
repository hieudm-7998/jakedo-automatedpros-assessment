'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getEpisodes } from '@/api/Episode/useEpisode';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRef } from 'react';
import Loader from '@/components/LoadingIndicator';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Episode } from '@/schema/EpisodeSchema';

export default function EpisodeInfiniteTable() {
  const router = useRouter();
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: async ({ pageParam = 1 }) => getEpisodes({ page: pageParam }),
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage?.info?.next;
      if (!nextUrl) return undefined;
      const url = new URL(nextUrl);
      return Number(url.searchParams.get('page') ?? undefined);
    },
    initialPageParam: 1,
  });

  const allEpisodes: Episode[] =
    data?.pages.flatMap((page) => page?.results ?? []) ?? [];

  const handleScroll = () => {
    const el = parentRef.current;
    if (!el || isFetchingNextPage || !hasNextPage) return;

    const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (scrollBottom < 100) fetchNextPage();
  };

  return (
    <div
      ref={parentRef}
      onScroll={handleScroll}
      className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3 max-h-[1000px] overflow-y-auto'
    >
      <h1 className='mb-6 py-10 font-bold text-3xl text-center'>
        All episodes
      </h1>

      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : isError ? (
        <div className='p-8 text-red-600 text-center'>
          Error loading episodes
        </div>
      ) : (
        <Table>
          <TableHeader className='top-0 z-10 sticky bg-[var(--main-color)]'>
            <TableRow>
              <TableHead>Episode</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Air Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className='text-right'>Favorite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allEpisodes.map((episode) => (
              <TableRow
                key={episode.id}
                className='hover:bg-gray-200 transition-all cursor-pointer'
                onClick={() => router.push(`/episodes/${episode.id}`)}
              >
                <TableCell className='font-medium'>{episode.episode}</TableCell>
                <TableCell>{episode.name}</TableCell>
                <TableCell>{episode.air_date}</TableCell>
                <TableCell>
                  {dayjs(episode.created).format('MM/DD/YYYY')}
                </TableCell>
                <TableCell className='text-right'>
                  <FavoriteButton
                    id={episode.id}
                    type='episode'
                    data={episode}
                  />
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
