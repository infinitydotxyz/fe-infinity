import { useEffect, useState } from 'react';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';

interface CardSelectionResult {
  toggleSelection: (data: ERC721CardData) => void;
  isSelected: (data: ERC721CardData) => boolean;
  isSelectable: (data: ERC721CardData) => boolean;
  removeFromSelection: (data: ERC721CardData) => void;
  selection: ERC721CardData[];
  clearSelection: () => void;
}

export const useCardSelection = (): CardSelectionResult => {
  const [selectionMap, setSelectionMap] = useState<Map<string, ERC721CardData>>(new Map());
  const [selection, setSelection] = useState<ERC721CardData[]>([]);

  useEffect(() => {
    setSelection(Array.from(selectionMap.values()));
  }, [selectionMap]);

  const toggleSelection = (value: ERC721CardData) => {
    if (!isSelected(value)) {
      // don't allow an already revealed and visible card to be added to cart
      const copy = new Map(selectionMap);
      copy.set(value.id, value);

      setSelectionMap(copy);
    } else {
      removeFromSelection(value);
    }
  };

  const isSelectable = (value: ERC721CardData): boolean => {
    return value.address !== null;
  };

  const removeFromSelection = (value: ERC721CardData) => {
    if (isSelected(value)) {
      const copy = new Map(selectionMap);
      copy.delete(value.id);

      setSelectionMap(copy);
    }
  };

  const isSelected = (value: ERC721CardData): boolean => {
    return selectionMap.has(value.id);
  };

  const clearSelection = () => {
    setSelectionMap(new Map());
  };

  return { selection, isSelected, isSelectable, clearSelection, toggleSelection, removeFromSelection };
};
