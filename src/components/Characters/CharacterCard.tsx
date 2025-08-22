import { Character } from '@/schema/CharacterSchema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { FavoriteButton } from '../FavoriteButton';

export default function CharacterCard(character: Character) {
  const router = useRouter();

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'Alive':
        return <span className='w-8 h-8 text-green-500'>●</span>;
      case 'Dead':
        return <span className='w-8 h-8 text-red-500'>●</span>;
      case 'unknown':
        return <span className='w-8 h-8 text-gray-500'>●</span>;
      default:
        return <span className='w-8 h-8 text-gray-500'>●</span>;
    }
  };
  return (
    <div
      className='group relative brand-shadow hover:shadow-none mb-2 border-2 border-black rounded-md transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY cursor-pointer'
      onClick={() => router.push(`/characters/${character.id}`)}
    >
      <FavoriteButton
        id={character.id}
        type='character'
        data={character}
        className='top-2 right-2 z-10 absolute'
      />
      <div>
        <Image
          src={character.image}
          alt={character.name}
          width={0}
          height={0}
          className='group-hover:opacity-80 rounded-t-md w-full min-w-[250px] h-[220px] object-center object-cover transition-all'
          unoptimized
          priority
        />
      </div>
      <div className='p-5'>
        <h1 className='mb-2 font-bold text-xl'>{character.name}</h1>
        <div className='mb-10 font-light text-sm italic capitalize'>
          {renderStatusIcon(character.status)} {character.status} -{' '}
          {character.species}
        </div>
        <Badge className='bg-[var(--main-color)]'>
          {character.location.name}
        </Badge>
      </div>
    </div>
  );
}
