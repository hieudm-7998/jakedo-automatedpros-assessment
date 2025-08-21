import { Location } from '@/schema/LocationSchema';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LocationCard(location: Location) {
  const router = useRouter();

  return (
    <div
      className='group brand-shadow hover:shadow-none mb-2 border-2 border-black rounded-md transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY cursor-pointer'
      onClick={() => router.push(`/locations/${location.id}`)}
    >
      <div>
        {/* <Image
          src={location.image}
          alt={location.name}
          width={0}
          height={0}
          className='group-hover:opacity-80 rounded-t-md w-full min-w-[250px] h-[220px] object-center object-cover transition-all'
          unoptimized
          priority
        /> */}
      </div>
      <div className='p-5'>
        {/* <h1 className='mb-2 font-bold text-xl'>{character.name}</h1> */}
        <div className='font-light text-sm italic capitalize'>
          {/* {renderStatusIcon(character.status)} {character.status} -{' '} */}
          {/* {character.species} */}
        </div>
      </div>
    </div>
  );
}