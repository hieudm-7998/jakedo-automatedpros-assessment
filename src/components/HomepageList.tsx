'use client';

import { useGetCharacters } from '@/api/Character/useCharacter';
// import { useGetEpisodes } from "@/api/Episode/useEpisode"
import { useGetLocations } from '@/api/Location/useLocation';
import Marquee from '@/components/ui/marquee';
import { Character } from '@/schema/CharacterSchema';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import CharacterCard from './CharacterCard';
import Loader from './LoadingIndicator';
import { useRandomNumber } from '@/utils/useRandomNumber';
import { Location } from '@/schema/LocationSchema';
import LocationCard from './LocationCard';

export default function HomepageList() {
  return (
    <div className='space-y-4'>
      <CharacterMarquee />
      <LocationMarquee />
    </div>
  );
}

const CharacterMarquee = () => {
  const randomNumber = useRandomNumber(1, 20);

  const { isLoading, data: charactersData } = useGetCharacters({
    page: randomNumber,
  });

  const characters = charactersData?.results || [];

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-7xl'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-3xl'>Characters</h2>
        <Link
          href='/characters'
          className='hover:opacity-50 text-xl transition-all'
        >
          View more <ChevronRight className='inline' />
        </Link>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : (
        <Marquee
          items={characters as Character[]}
          renderItem={(character: Character) => (
            <CharacterCard {...character} />
          )}
        />
      )}
    </div>
  );
};

const LocationMarquee = () => {
  const randomNumber = useRandomNumber(1, 7);

  const { isLoading, data: locationsData } = useGetLocations({
    page: randomNumber,
  });

  const locations = locationsData?.results || [];

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-7xl'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-3xl'>Locations</h2>
        <Link
          href='/locations'
          className='hover:opacity-50 text-xl transition-all'
        >
          View more <ChevronRight className='inline' />
        </Link>
      </div>
      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : (
        <Marquee
          items={locations as Location[]}
          renderItem={(location: Location) => <LocationCard {...location} />}
        />
      )}
    </div>
  );
};
