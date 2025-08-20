'use client';

import { useGetEpisodes } from '@/api/Episode/useEpisode';
import Link from 'next/link';

export default function EpisodesPage() {
    const { data, isLoading } = useGetEpisodes(1);

    if (isLoading) return <div>Loading episodes...</div>;

    return (
        <div>
            <h1>Episodes</h1>
            <ul>
                {data?.results.map((ep: any) => (
                    <li key={ep.id}>
                        <Link href={`/episodes/${ep.id}`}>
                            {ep.name} - {ep.episode}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
