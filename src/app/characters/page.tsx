'use client';

import { useGetCharacters } from '@/api/Character/useCharacter';
import Link from 'next/link';

export default function CharactersPage() {
    const { data, isLoading } = useGetCharacters({ page: 1 });

    if (isLoading) return <div>Loading characters...</div>;

    return (
        <div>
            <h1>Characters</h1>
            <ul>
                {data?.results.map((c: any) => (
                    <li key={c.id}>
                        <Link href={`/characters/${c.id}`}>
                            {c.name} ({c.status})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
