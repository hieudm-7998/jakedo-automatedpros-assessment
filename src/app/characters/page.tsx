'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetCharacters } from '@/api/Character/useCharacter';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CharacterCard from '@/components/Characters/CharacterCard';
import { debounce } from 'lodash';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CharactersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const name = searchParams.get('name') ?? '';
  const status = searchParams.get('status') ?? '';
  const gender = searchParams.get('gender') ?? '';

  const [searchName, setSearchName] = useState(name);

  const setFilter = (filters: {
    [key: string]: string | number | undefined;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === undefined) params.delete(key);
      else params.set(key, String(value));
    });
    router.push(`?${params.toString()}`);
  };

  const debouncedSetFilter = useRef(
    debounce((value: string) => setFilter({ name: value, page: 1 }), 500)
  ).current;

  useEffect(() => {
    setSearchName(name);
  }, [name]);

  const { data, isLoading, isFetching } = useGetCharacters(
    { page, name, status, gender },
    {
      staleTime: 1000 * 60,
      retry: false,
    }
  );

  const totalPages = data?.info?.pages ?? 0;

  const pages = useMemo(() => {
    const delta = 2;
    if (!totalPages) return [];
    return Array.from(
      { length: Math.min(totalPages, delta * 2 + 1) },
      (_, i) => i + Math.max(1, page - delta)
    ).filter((p) => p <= totalPages);
  }, [page, totalPages]);

  const skeletonCount = 12;

  useEffect(() => {
    return () => {
      debouncedSetFilter.cancel();
    };
  }, [debouncedSetFilter]);

  return (
    <div className='bg-white brand-shadow mx-auto p-8 border-2 rounded w-full max-w-2/3'>
      <h1 className='mb-6 py-10 font-bold text-3xl text-center'>
        All characters
      </h1>

      <div className='flex gap-4 mb-6'>
        <Input
          type='text'
          placeholder='Search character by name...'
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            debouncedSetFilter(e.target.value);
          }}
          className='flex-1'
        />

        <Select
          value={status || undefined}
          onValueChange={(value) => setFilter({ status: value, page: 1 })}
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Any Status' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value='alive'>Alive</SelectItem>
              <SelectItem value='dead'>Dead</SelectItem>
              <SelectItem value='unknown'>Unknown</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={gender || undefined}
          onValueChange={(value) => setFilter({ gender: value, page: 1 })}
        >
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Any Gender' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectGroup>
              <SelectLabel>Gender</SelectLabel>
              <SelectItem value='male'>Male</SelectItem>
              <SelectItem value='female'>Female</SelectItem>
              <SelectItem value='genderless'>Genderless</SelectItem>
              <SelectItem value='unknown'>Unknown</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {isLoading || isFetching ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div
              key={i}
              className='bg-gray-200 rounded-md h-60 animate-pulse'
            />
          ))
        ) : data?.results.length ? (
          data.results.map((c) => <CharacterCard key={c.id} {...c} />)
        ) : (
          <div className='col-span-full py-20 text-center'>
            No results found
          </div>
        )}
      </div>

      {!isLoading && (data?.results?.length ?? 0) > 0 && totalPages > 1 && (
        <div className='flex justify-center mt-10'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setFilter({ page: page - 1 });
                  }}
                />
              </PaginationItem>

              {pages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href='#'
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setFilter({ page: p });
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {page + 2 < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setFilter({ page: page + 1 });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
