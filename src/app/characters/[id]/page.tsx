'use client';

import { useGetCharacterById } from '@/api/Character/useCharacter';
import { useParams } from 'next/navigation';
import Image from 'next/image';

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: character, isLoading } = useGetCharacterById(id);

  if (isLoading) return <div>Loading character...</div>;

  console.log('Character data:', character);
  if (!character) return <div>Character not found</div>;

  return (
    <div>
      <h1>{character.name}</h1>
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <Image
        src={character.image}
        alt={character.name}
        width={300}
        height={300}
        priority
      />
    </div>
  );
}
