import { getLocationById } from '@/api/Location/useLocation';
import type { Metadata } from 'next';
import LocationDetailClient from './LocationDetailClient';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const location = await getLocationById(id);

  if (!location) {
    return { title: 'Location not found' };
  }

  const title = `${location.name} — ${location.type || 'Location'}`;
  const description = `Dimension: ${location.dimension || 'Unknown'}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function LocationDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <LocationDetailClient id={id} />;
}
