import { useEffect, useState } from 'react';
import { getTokenKeyId } from 'src/utils';
import { Erc721TokenOffer } from './types';

interface NFTSelectionResult {
  toggleNFTSelection: (data: Erc721TokenOffer) => void;
  isNFTSelected: (data: Erc721TokenOffer) => boolean;
  isNFTSelectable: (data: Erc721TokenOffer) => boolean;
  removeNFTFromSelection: (data?: Erc721TokenOffer) => void; // null to remove all
  nftSelection: Erc721TokenOffer[];
  clearNFTSelection: () => void;
}

export const useNFTSelection = (): NFTSelectionResult => {
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

  return {
    nftSelection: selection,
    isNFTSelected: isSelected,
    isNFTSelectable: isSelectable,
    clearNFTSelection: clearSelection,
    toggleNFTSelection: toggleSelection,
    removeNFTFromSelection: removeFromSelection
  };
};
