'use client';

import { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useGetCharacters } from '@/api/Character/useCharacter';
import { useGetEpisodes } from '@/api/Episode/useEpisode';
import { useGetLocations } from '@/api/Location/useLocation';
import { Button } from '../ui/button';
import { Character } from '@/schema/CharacterSchema';
import { Location } from '@/schema/LocationSchema';
import { Episode } from '@/schema/EpisodeSchema';
import Link from 'next/link';

const links = [
  {
    href: '/characters',
    label: 'Characters',
  },
  {
    href: '/episodes',
    label: 'Episodes',
  },
  {
    href: '/locations',
    label: 'Locations',
  },
  {
    href: '/favorites',
    label: 'Favorites',
  },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [resource, setResource] = useState<
    'characters' | 'episodes' | 'locations'
  >('characters');
  const [search, setSearch] = useState('');

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedSearch(val);
      }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceSearch(e.target.value);
  };

  const { data: charData } = useGetCharacters(
    resource === 'characters' && debouncedSearch
      ? { name: debouncedSearch, page: 1 }
      : {}
  );
  const { data: epData } = useGetEpisodes(
    resource === 'episodes' && debouncedSearch
      ? { name: debouncedSearch, page: 1 }
      : {}
  );
  const { data: locData } = useGetLocations(
    resource === 'locations' && debouncedSearch
      ? { name: debouncedSearch, page: 1 }
      : {}
  );

  const results =
    resource === 'characters'
      ? charData?.results || []
      : resource === 'episodes'
      ? epData?.results || []
      : locData?.results || [];

  const handleSelectResult = (id: number | string) => {
    router.push(`/${resource}/${id}`);
    setSearch('');
    setDebouncedSearch('');
  };

  return (
    <div className='relative bg-white brand-shadow mx-auto mb-5 px-8 py-10 border-2 rounded w-full max-w-2/3'>
      <div className='flex justify-between items-center'>
        <Link href='/' className='font-bold text-4xl'>
          Rick & Morty Database
        </Link>
        <div className='flex items-center gap-2'>
          <div className='space-x-8 mr-8'>
            {links.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + '/');

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg transition-all ${
                    isActive
                      ? 'text-[var(--main-color)]'
                      : 'hover:text-[var(--main-color)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <Input
            className='w-[250px]'
            type='text'
            placeholder={`Search ${resource}...`}
            value={search}
            onChange={handleSearchChange}
          />

          <Select
            defaultValue='characters'
            onValueChange={(val: 'characters' | 'episodes' | 'locations') =>
              setResource(val)
            }
          >
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Select type' />
            </SelectTrigger>
            <SelectContent className='bg-white w-[200px]'>
              <SelectGroup>
                <SelectItem className='cursor-pointer' value='characters'>
                  Character
                </SelectItem>
                <SelectItem className='cursor-pointer' value='episodes'>
                  Episode
                </SelectItem>
                <SelectItem className='cursor-pointer' value='locations'>
                  Location
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dropdown results */}
      {debouncedSearch && results.length > 0 && (
        <Card className='top-22 right-8 z-50 absolute bg-white brand-shadow py-0 border-2 w-full max-w-lg max-h-[300px] overflow-y-auto'>
          <CardContent className='flex flex-col gap-1 p-2'>
            {results.map((item: Character | Location | Episode) => (
              <Button
                key={item.id}
                className='flex justify-between items-center hover:bg-gray-100 p-2 border-0 w-full transition-colors'
                onClick={() => handleSelectResult(item.id)}
              >
                {resource === 'characters' && (
                  <>
                    <span className='text-lg'>{item.name}</span>
                    <span className='text-zinc-600 italic'>Character</span>
                  </>
                )}
                {resource === 'episodes' && 'episode' in item && (
                  <>
                    <span className='text-lg'>{item.name}</span>
                    <span className='text-zinc-600 italic'>{item.episode}</span>
                  </>
                )}
                {resource === 'locations' && 'dimension' in item && (
                  <>
                    <span className='text-lg'>{item.name}</span>
                    <span className='text-zinc-600 italic'>
                      {item.dimension}
                    </span>
                  </>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
