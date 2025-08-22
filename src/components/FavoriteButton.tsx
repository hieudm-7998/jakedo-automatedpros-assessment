'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Heart } from 'lucide-react';
import { useFavorite } from '@/hooks/useFavorite';
import { Character } from '@/schema/CharacterSchema';
import { Location } from '@/schema/LocationSchema';
import { Episode } from '@/schema/EpisodeSchema';
import { toast } from 'sonner';

type FavoriteButtonProps = {
  id: string | number;
  type: 'character' | 'episode' | 'location';
  data: Character | Location | Episode;
  className?: string;
  size?: 'icon' | 'default' | 'sm' | 'lg';
};

export function FavoriteButton({
  id,
  type,
  data,
  className,
  size = 'icon',
}: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorite();
  const fav = isFavorite(id, type);

  const handleClickFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({ id, type, data });

    if (fav) {
      toast(
        <span>
          <span className='text-[var(--main-color)]'>{data.name}</span> has been
          removed from favorite.
        </span>
      );
    } else {
      toast(
        <span>
          <span className='text-[var(--main-color)]'>{data.name}</span> has been
          added to favorite.
        </span>
      );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={size}
            className={`group/heart ${className ?? ''} bg-white ${
              !fav && 'hover:bg-[var(--main-color)]'
            } transition-all`}
            onClick={handleClickFavorite}
          >
            <Heart
              className={`transition-all ${
                fav
                  ? 'text-[var(--main-color)] fill-[var(--main-color)]'
                  : 'group-hover/heart:text-white'
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent className='bg-white text-black'>
          <p>{fav ? 'Remove from favorite' : 'Add to favorite'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
