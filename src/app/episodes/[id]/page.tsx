import { getEpisodeById } from '@/api/Episode/useEpisode';
import type { Metadata } from 'next';
import EpisodeDetailClient from './EpisodeDetailClient';

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const episode = await getEpisodeById(id);

  if (!episode) {
    return { title: 'Episode not found' };
  }

  return {
    title: `${episode.episode} - ${episode.name}`,
    description: episode.name || 'Detailed Rick & Morty episode view',
    openGraph: {
      title: `${episode.episode} - ${episode.name}`,
      description: episode.name,
    },
  };
}

export default async function EpisodeDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <EpisodeDetailClient id={id} />;
}
