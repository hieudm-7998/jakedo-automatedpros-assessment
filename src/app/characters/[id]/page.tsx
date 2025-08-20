'use client';

import { useGetCharacterById } from '@/api/Character/useCharacter';
import { useParams } from 'next/navigation';

export default function CharacterDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useGetCharacterById(id as string);

    if (isLoading) return <div>Loading character...</div>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>Status: {data.status}</p>
            <p>Species: {data.species}</p>
            <img src={data.image} alt={data.name} />
        </div>
    );
}
