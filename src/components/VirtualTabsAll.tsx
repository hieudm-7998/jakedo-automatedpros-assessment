'use client';

import { useGetCharacters } from '@/api/Character/useCharacter';
// import { useGetEpisodes } from "@/api/Episode/useEpisode"
// import { useGetLocations } from "@/api/Location/useLocation"
import Marquee from '@/components/ui/marquee';
import { Card } from './ui/card';
import { Character } from '@/schema/CharacterSchema';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VirtualTabsAll() {
  const { isLoading, data: charactersData } = useGetCharacters(
    { page: 1 },
    {
      staleTime: 1000 * 60 * 5,
    }
  );
  // const { data: episodesData } = useGetEpisodes(
  //     { page: 1 },
  //     {
  //         staleTime: 1000 * 60 * 5
  //     }
  // )
  // const { data: locationsData } = useGetLocations(
  //     { page: 1 },
  //     {
  //         staleTime: 1000 * 60 * 5
  //     }
  // )

  const characters = charactersData?.results || [];
  console.log('characters', characters);
  // const episodes = episodesData?.results || []
  // const locations = locationsData?.results || []

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='font-bold text-3xl'>Characters</h2>
          <Link href='/characters'>
            View more <ChevronRight className='inline' />
          </Link>
        </div>
        <Marquee
          items={characters as Character[]}
          renderItem={(character: Character) => (
            <CharacterCard {...character} />
          )}
        />
      </div>
    </div>
  );
}

const CharacterCard = (character: Character) => {
  const router = useRouter();

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
  return (
    <div
      className='relative brand-shadow hover:shadow-none mb-2 border-2 border-black rounded-md transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY cursor-pointer'
      onClick={() => router.push(`/characters/${character.id}`)}
    >
      <div className='top-3 right-3 absolute'></div>
      <div>
        <Image
          src={character.image}
          alt={character.name}
          width={0}
          height={0}
          className='rounded-t-md w-full min-w-[250px] h-[220px] object-center object-cover'
          unoptimized
          priority
        />
      </div>
      <div className='p-5'>
        <h1 className='mb-2 font-bold text-xl'>{character.name}</h1>
        <div className='font-light text-sm italic capitalize'>
          {renderStatusIcon(character.status)} {character.status} -{' '}
          {character.species}
        </div>
      </div>
    </div>
  );
};
