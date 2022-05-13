import { CardData } from '@infinityxyz/lib/types/core';
import { useState } from 'react';

interface CardSelectionResult {
  toggleSelection: (data: CardData) => void;
  isSelected: (data: CardData) => boolean;
  removeFromSelection: (data: CardData) => void;
  hasSelection: () => boolean;
  selectedCards: () => CardData[];
  clearSelection: () => void;
}

export const useCardSelection = (): CardSelectionResult => {
  const [selection, setSelection] = useState<CardData[]>([]);

  const toggleSelection = (data: CardData) => {
    const i = indexOfSelection(data);

    if (i === -1) {
      setSelection([...selection, data]);
    } else {
      removeFromSelection(data);
    }
  };

  const indexOfSelection = (value: CardData): number => {
    const i = selection.findIndex((token) => {
      return value.id === token.id;
    });

    return i;
  };

  const removeFromSelection = (value: CardData) => {
    const i = indexOfSelection(value);

    if (i !== -1) {
      const copy = [...selection];
      copy.splice(i, 1);

      setSelection(copy);
    }
  };

  const hasSelection = () => {
    return selection.length > 0;
  };

  const selectedCards = (): CardData[] => {
    return selection;
  };

  const isSelected = (value: CardData): boolean => {
    return indexOfSelection(value) !== -1;
  };

  const clearSelection = () => {
    setSelection([]);
  };

  return { selectedCards, isSelected, clearSelection, toggleSelection, removeFromSelection, hasSelection };
};
