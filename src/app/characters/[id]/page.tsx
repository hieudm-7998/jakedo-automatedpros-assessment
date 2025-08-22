import { getCharacterById } from '@/api/Character/useCharacter';
import type { Metadata } from 'next';
import CharacterDetailClient from './CharacterDetailClient';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const character = await getCharacterById(id);

  if (!character) {
    return { title: 'Character not found' };
  }

  return {
    title: character.name,
    description: character.name || 'Detailed Rick & Morty character view',
    openGraph: {
      title: character.name,
      description: character.name,
      images: [character.image],
    },
  };
}

export default async function CharacterDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <CharacterDetailClient id={id} />;
}
