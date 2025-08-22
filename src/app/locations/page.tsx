'use client';

import dynamic from 'next/dynamic';

const LocationInfiniteTable = dynamic(
  () => import('@/components/Locations/LocationInfiniteTable'),
  { ssr: false }
);

export default function LocationsPage() {
  return <LocationInfiniteTable />;
}
