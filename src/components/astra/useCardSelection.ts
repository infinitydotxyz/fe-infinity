import { useEffect, useState } from 'react';
import { getTokenKeyId } from 'src/utils';
import { Erc721TokenOffer } from './types';

interface CardSelectionResult {
  toggleSelection: (data: Erc721TokenOffer) => void;
  isSelected: (data: Erc721TokenOffer) => boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  removeFromSelection: (data?: Erc721TokenOffer) => void; // null to remove all
  selection: Erc721TokenOffer[];
  clearSelection: () => void;
}

export const useCardSelection = (): CardSelectionResult => {
  const [selectionMap, setSelectionMap] = useState<Map<string, Erc721TokenOffer>>(new Map());
  const [selection, setSelection] = useState<Erc721TokenOffer[]>([]);

  useEffect(() => {
    setSelection(Array.from(selectionMap.values()));
  }, [selectionMap]);

  const toggleSelection = (value: Erc721TokenOffer) => {
    if (!isSelected(value)) {
      const copy = new Map(selectionMap);
      copy.set(getTokenKeyId(value), value);

      setSelectionMap(copy);
    } else {
      removeFromSelection(value);
    }
  };

  const isSelectable = (value: Erc721TokenOffer): boolean => {
    return value.address !== null;
  };

  const removeFromSelection = (value?: Erc721TokenOffer) => {
    if (value) {
      if (isSelected(value)) {
        const copy = new Map(selectionMap);
        copy.delete(getTokenKeyId(value));

        setSelectionMap(copy);
      }
    } else {
      setSelectionMap(new Map());
    }
  };

  const isSelected = (value: Erc721TokenOffer): boolean => {
    return selectionMap.has(getTokenKeyId(value));
  };

  const clearSelection = () => {
    setSelectionMap(new Map());
  };

  return { selection, isSelected, isSelectable, clearSelection, toggleSelection, removeFromSelection };
};
