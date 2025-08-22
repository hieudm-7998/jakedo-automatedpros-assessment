'use client';

import { useGetLocationById } from '@/api/Location/useLocation';
import { useGetCharactersByIds } from '@/api/Character/useCharacter';
import { Skeleton } from '@/components/ui/skeleton';
import CharacterCard from '@/components/Characters/CharacterCard';

export default function LocationDetailClient({ id }: { id: string }) {
  const { data: location, isLoading, error } = useGetLocationById(id);

  const residentIds =
    location?.residents
      ?.map((url) => url.split('/').pop() || '')
      .filter(Boolean) ?? [];

  const {
    data: residents,
    isLoading: isLoadingResidents,
    error: residentsError,
  } = useGetCharactersByIds(residentIds);

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
        Error loading location.
      </div>
    );
  }

  if (!location) {
    return (
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        Location not found.
      </div>
    );
  }

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <h1 className='mb-2 font-semibold text-3xl'>{location.name}</h1>
      <div className='text-xl italic'>Type: {location.type || 'Unknown'}</div>
      <div className='mb-10 text-xl italic'>
        Dimension: {location.dimension || 'Unknown'}
      </div>

      <div className='space-y-4'>
        <h2 className='font-semibold text-2xl'>Residents in this location:</h2>
        {isLoadingResidents ? (
          <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='rounded-md w-full h-[200px]' />
            ))}
          </div>
        ) : residentsError ? (
          <div>Error loading residents.</div>
        ) : residents && residents.length > 0 ? (
          <div className='gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {residents.map((resident) => (
              <CharacterCard key={resident.id} {...resident} />
            ))}
          </div>
        ) : (
          <div>No residents found.</div>
        )}
      </div>
    </div>
  );
}
