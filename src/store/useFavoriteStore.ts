import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character } from '@/schema/CharacterSchema';
import { Location } from '@/schema/LocationSchema';
import { Episode } from '@/schema/EpisodeSchema';

type FavoriteType = 'character' | 'location' | 'episode';

interface FavoriteItem {
  id: number | string;
  type: FavoriteType;
  data: Character | Location | Episode;
}

interface FavoriteState {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: number | string, type: FavoriteType) => void;
  isFavorite: (id: number | string, type: FavoriteType) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) =>
        set((state) => {
          if (
            state.favorites.find(
              (f) => f.id === item.id && f.type === item.type
            )
          ) {
            return state;
          }
          return { favorites: [...state.favorites, item] };
        }),

      removeFavorite: (id, type) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.id === id && f.type === type)
          ),
        })),

      isFavorite: (id, type) =>
        !!get().favorites.find((f) => f.id === id && f.type === type),
    }),
    {
      name: 'favorite-storage',
    }
  )
);
