'use client';

import { useGetCharacters } from '@/api/Character/useCharacter';
import { useGetEpisodes } from '@/api/Episode/useEpisode';
import { useGetLocations } from '@/api/Location/useLocation';
import Marquee from '@/components/ui/marquee';
import { Character } from '@/schema/CharacterSchema';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import CharacterCard from '../Characters/CharacterCard';
import Loader from '../LoadingIndicator';
import { useRandomNumber } from '@/utils/useRandomNumber';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { FavoriteButton } from '../FavoriteButton';

export default function HomepageList() {
  return (
    <div className='space-y-4'>
      <CharacterMarquee />
      <LocationListTable />
      <EpisodeListTable />
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
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-3xl'>Characters</h2>
        <Link
          href='/characters'
          className='hover:text-[var(--main-color)] text-xl transition-all'
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

const LocationListTable = () => {
  const router = useRouter();
  const randomNumber = useRandomNumber(1, 7);

  const { isLoading, data: locationsData } = useGetLocations({
    page: randomNumber,
  });
  const locations = locationsData?.results || [];

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-3xl'>Locations</h2>
        <Link
          href='/locations'
          className='hover:text-[var(--main-color)] text-xl transition-all'
        >
          View more <ChevronRight className='inline' />
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : (
        <div className='max-h-[400px] overflow-y-auto'>
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
              {locations.map((location) => (
                <TableRow
                  key={location.id}
                  className='hover:bg-gray-200 transition-all cursor-pointer'
                  onClick={() => router.push(`/locations/${location.id}`)}
                >
                  <TableCell className='font-medium'>{location.name}</TableCell>
                  <TableCell>
                    {location.type === '' ? '-' : location.type}
                  </TableCell>
                  <TableCell>{location.dimension}</TableCell>
                  <TableCell>
                    {dayjs(location.created).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell className='text-right'>
                    <FavoriteButton
                      id={location.id}
                      type='location'
                      data={location}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const EpisodeListTable = () => {
  const router = useRouter();

  const { isLoading, data: episodesData } = useGetEpisodes({
    page: 3,
  });

  const episodes = episodesData?.results
    ? [...episodesData.results].reverse()
    : [];

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-3xl'>Latest episodes</h2>
        <Link
          href='/episodes'
          className='hover:text-[var(--main-color)] text-xl transition-all'
        >
          View more <ChevronRight className='inline' />
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-28'>
          <Loader size={40} />
        </div>
      ) : (
        <div className='max-h-[400px] overflow-y-auto'>
          <Table>
            <TableHeader className='top-0 z-10 sticky bg-[var(--main-color)]'>
              <TableRow>
                <TableHead>Episode</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Air date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Favorite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((episode) => (
                <TableRow
                  key={episode.id}
                  className='hover:bg-gray-200 transition-all cursor-pointer'
                  onClick={() => router.push(`/episodes/${episode.id}`)}
                >
                  <TableCell className='font-medium'>
                    {episode.episode}
                  </TableCell>
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
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
