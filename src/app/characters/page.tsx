'use client';

import dynamic from 'next/dynamic';

const CharactersPage = dynamic(
  () => import('@/components/Characters/CharactersPage'),
  { ssr: false }
);

export default function LocationsPage() {
  return <CharactersPage />;
}
