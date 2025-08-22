'use client';

import { useFavorite } from '@/hooks/useFavorite';
import CharacterCard from '@/components/Characters/CharacterCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { FavoriteButton } from '@/components/FavoriteButton';
import { Character } from '@/schema/CharacterSchema';
import { Location } from '@/schema/LocationSchema';
import { Episode } from '@/schema/EpisodeSchema';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorite();

  const characters = favorites.filter((f) => f.type === 'character');
  const locations = favorites.filter((f) => f.type === 'location');
  const episodes = favorites.filter((f) => f.type === 'episode');

  return (
    <div className='space-y-16 py-10'>
      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        <h1 className='mb-6 py-4 font-bold text-3xl text-center'>
          Your favorite characters
        </h1>
        {characters.length === 0 ? (
          <div className='py-20 text-center'>No favorite characters. Try to add some.</div>
        ) : (
          <div className='gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {characters.map((c) => {
              const character = c.data as Character;
              return <CharacterCard key={c.id} {...character} />;
            })}
          </div>
        )}
      </div>

      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        <h1 className='mb-6 py-4 font-bold text-3xl text-center'>
          Your favorite locations
        </h1>
        {locations.length === 0 ? (
          <div className='py-20 text-center'>No favorite locations. Try to add some.</div>
        ) : (
          <div className='max-h-[600px] overflow-y-auto'>
            <Table>
              <TableHeader className='top-0 z-10 sticky bg-white'>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dimension</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Favorite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((loc) => {
                  const location = loc.data as Location;
                  return (
                    <TableRow
                      key={loc.id}
                      className='hover:bg-gray-200 transition-all cursor-pointer'
                      onClick={() => router.push(`/locations/${loc.id}`)}
                    >
                      <TableCell className='font-medium'>
                        {location.name}
                      </TableCell>
                      <TableCell>{location.type || '-'}</TableCell>
                      <TableCell>{location.dimension}</TableCell>
                      <TableCell>
                        {dayjs(location.created).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell className='text-right'>
                        <FavoriteButton
                          id={loc.id}
                          type='location'
                          data={location}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
        <h1 className='mb-6 py-4 font-bold text-3xl text-center'>
          Your favorite episodes
        </h1>
        {episodes.length === 0 ? (
          <div className='py-20 text-center'>No favorite episodes. Try to add some.</div>
        ) : (
          <div className='max-h-[600px] overflow-y-auto'>
            <Table>
              <TableHeader className='top-0 z-10 sticky bg-white'>
                <TableRow>
                  <TableHead>Episode</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Air Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className='text-right'>Favorite</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episodes.map((ep) => {
                  const episode = ep.data as Episode;
                  return (
                    <TableRow
                      key={ep.id}
                      className='hover:bg-gray-200 transition-all cursor-pointer'
                      onClick={() => router.push(`/episodes/${ep.id}`)}
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
                          id={ep.id}
                          type='episode'
                          data={episode}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
