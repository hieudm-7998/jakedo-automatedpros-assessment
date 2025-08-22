'use client';

import { useGetCharacterById } from '@/api/Character/useCharacter';
import { useGetEpisodeById } from '@/api/Episode/useEpisode';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CharacterDetailClient({ id }: { id: string }) {
  const {
    data: character,
    isLoading,
    error,
  } = useGetCharacterById(id, {
    retry: false,
  });

  const firstEpisodeId = character?.episode?.[0]
    ? character.episode[0].split('/').pop()
    : null;

  const { data: firstSeenEpisode, isLoading: isLoadingEpisode } =
    useGetEpisodeById(firstEpisodeId ?? '', {
      enabled: !!firstEpisodeId,
      retry: false,
    });

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Alive':
        return <span className='w-8 h-8 text-green-500'>●</span>;
      case 'Dead':
        return <span className='w-8 h-8 text-red-500'>●</span>;
      case 'unknown':
        return <span className='w-8 h-8 text-gray-500'>●</span>;
      default:
        return <span className='w-8 h-8 text-gray-500'>●</span>;
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        <div className='flex gap-6'>
          <Skeleton className='rounded-t-md w-[250px] h-[250px] object-center object-cover transition-all' />
          <div className='flex-1 space-y-4'>
            <Skeleton className='w-1/2 h-8' />
            <Skeleton className='w-1/3 h-6' />
            <Skeleton className='w-2/3 h-6' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    if (error.message === 'Character not found') {
      return (
        <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
          Character not found.
        </div>
      );
    }

    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        Error loading character.
      </div>
    );
  }

  const locationId = character?.location?.url?.split('/').pop();

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <div className='flex gap-6'>
        <div className='relative rounded-t-md w-[250px] h-[250px] overflow-hidden'>
          {character?.image ? (
            <Image
              src={character.image}
              alt={character?.name ?? 'Character'}
              width={250}
              height={250}
              className='group-hover:opacity-80 w-full h-full object-cover transition-all'
              unoptimized
              priority
            />
          ) : (
            <Skeleton className='w-full h-full' />
          )}
        </div>
        <div className='flex-1'>
          <h1 className='font-semibold text-3xl'>
            {character?.name ?? 'Unknown Character'}
          </h1>
          <div className='mb-10 font-light text-xl italic capitalize'>
            {character?.status && renderStatusIcon(character.status)}{' '}
            {character?.status ?? 'Unknown'} - {character?.species ?? 'Unknown'}
          </div>
          <div className='flex items-center gap-2 text-xl'>
            <h1>Last known location: </h1>
            <div className='flex items-center gap-2 hover:text-[var(--main-color)] transition-all'>
              <Link href={locationId ? `/locations/${locationId}` : '#'}>
                {character?.location?.name ?? 'Unknown'}
              </Link>
              <ExternalLink size={16} />
            </div>
          </div>
          <div className='flex items-center gap-2 text-xl'>
            <h1>First seen in: </h1>
            <div className='flex items-center gap-2 hover:text-[var(--main-color)] transition-all'>
              <Link href={`/episodes/${firstSeenEpisode?.id}`}>
                {isLoadingEpisode ? (
                  <Skeleton className='w-[200px] h-8' />
                ) : firstSeenEpisode ? (
                  `${firstSeenEpisode.episode} - ${firstSeenEpisode?.name}`
                ) : (
                  'Unknown Episode'
                )}
              </Link>
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
