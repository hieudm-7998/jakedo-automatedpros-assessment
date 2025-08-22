'use client';

import { useGetEpisodeById } from '@/api/Episode/useEpisode';
import { useGetCharactersByIds } from '@/api/Character/useCharacter';
import { Skeleton } from '@/components/ui/skeleton';
import CharacterCard from '@/components/Characters/CharacterCard';

export default function EpisodeDetailClient({ id }: { id: string }) {
  const {
    data: episode,
    isLoading,
    error,
  } = useGetEpisodeById(id, { retry: false });

  const characterIds =
    episode?.characters.map((url) => url.split('/').pop()!).filter(Boolean) ??
    [];

  const { data: characters, isLoading: isLoadingCharacters } =
    useGetCharactersByIds(characterIds);

  if (isLoading) {
    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        <div className='space-y-4'>
          <Skeleton className='w-1/2 h-8' />
          <Skeleton className='w-1/3 h-6' />
          <Skeleton className='w-1/4 h-6' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        Error loading episode.
      </div>
    );
  }

  if (!episode) {
    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        Episode not found.
      </div>
    );
  }

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <h1 className='font-semibold text-3xl'>
        {episode.episode} - {episode.name}
      </h1>
      <div className='mb-10 text-xl italic'>
        Air date: {episode.air_date || 'Unknown'}
      </div>

      <div className='space-y-4'>
        <h2 className='font-semibold text-2xl'>
          Characters appeared in this episode:
        </h2>
        {isLoadingCharacters ? (
          <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='rounded-md w-full h-[200px]' />
            ))}
          </div>
        ) : characters && characters.length > 0 ? (
          <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {characters.map((character) => (
              <CharacterCard key={character.id} {...character} />
            ))}
          </div>
        ) : (
          <div>No characters found.</div>
        )}
      </div>
    </div>
  );
}
