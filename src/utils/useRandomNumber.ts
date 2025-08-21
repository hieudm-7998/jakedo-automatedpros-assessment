import { useState } from 'react';

export function useRandomNumber(min: number, max: number) {
  const [randomNumber] = useState(() => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });

  return randomNumber;
}
