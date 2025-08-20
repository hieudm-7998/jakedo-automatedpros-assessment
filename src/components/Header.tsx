'use client';

import { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useLocationsSearch } from '@/queries/locations';
import { useRouter } from 'next/navigation';

export default function HeaderSearch() {
    const [type, setType] = useState<'character' | 'episode' | 'location'>('character');
    const [query, setQuery] = useState('');
    const router = useRouter();

    const debouncedSetQuery = useMemo(
        () => debounce((val: string) => setQuery(val), 400),
        []
    );

    useEffect(() => {
        return () => {
            debouncedSetQuery.cancel();
        };
    }, [debouncedSetQuery]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetQuery(e.target.value);
    };

    // call query theo type
    const { data: characters } = useCharactersSearch(query, { enabled: type === 'character' && !!query });
    const { data: episodes } = useEpisodesSearch(query, { enabled: type === 'episode' && !!query });
    const { data: locations } = useLocationsSearch(query, { enabled: type === 'location' && !!query });

    const results = type === 'character' ? characters :
        type === 'episode' ? episodes :
            locations;

    return (
        <div className="w-full max-w-xl mx-auto mt-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder={`Search ${type}...`}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                />
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="border px-2 py-2 rounded"
                >
                    <option value="character">Character</option>
                    <option value="episode">Episode</option>
                    <option value="location">Location</option>
                </select>
            </div>

            {query && results?.length > 0 && (
                <ul className="mt-2 border rounded bg-white shadow divide-y">
                    {results.map((item: any) => (
                        <li
                            key={item.id}
                            onClick={() => router.push(`/${type}/${item.id}`)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {type === 'character' ? (
                                <div className="flex items-center gap-2">
                                    <img src={item.image} alt={item.name} className="w-6 h-6 rounded-full" />
                                    <span>{item.name}</span>
                                </div>
                            ) : (
                                <span>{item.name}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
