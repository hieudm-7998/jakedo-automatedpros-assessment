'use client';

import { useGetEpisodeById } from '@/api/Episode/useEpisode';
import { useParams } from 'next/navigation';

export default function EpisodeDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useGetEpisodeById(id as string);

    if (isLoading) return <div>Loading episode...</div>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>Air date: {data.air_date}</p>
            <p>Code: {data.episode}</p>
        </div>
    );
}
