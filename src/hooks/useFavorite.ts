import { useFavoriteStore } from '@/store/useFavoriteStore';
import { Character } from '@/schema/CharacterSchema';
import { Location } from '@/schema/LocationSchema';
import { Episode } from '@/schema/EpisodeSchema';

export function useFavorite() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const addFavorite = useFavoriteStore((state) => state.addFavorite);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const toggleFavorite = (item: {
    id: number | string;
    type: 'character' | 'location' | 'episode';
    data: Character | Location | Episode;
  }) => {
    if (isFavorite(item.id, item.type)) {
      removeFavorite(item.id, item.type);
    } else {
      addFavorite(item);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
