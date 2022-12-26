import { useEffect, useState } from 'react';
import { getCollectionKeyId } from 'src/utils';
import { Erc721CollectionOffer } from './types';

interface CollectionSelectionResult {
  toggleCollSelection: (data: Erc721CollectionOffer) => void;
  isCollSelected: (data: Erc721CollectionOffer) => boolean;
  isCollSelectable: (data: Erc721CollectionOffer) => boolean;
  removeCollFromSelection: (data?: Erc721CollectionOffer) => void; // null to remove all
  collSelection: Erc721CollectionOffer[];
  clearCollSelection: () => void;
}

export const useCollectionSelection = (): CollectionSelectionResult => {
  const [collSelectionMap, setCollSelectionMap] = useState<Map<string, Erc721CollectionOffer>>(new Map());
  const [collSelection, setCollSelection] = useState<Erc721CollectionOffer[]>([]);

  useEffect(() => {
    setCollSelection(Array.from(collSelectionMap.values()));
  }, [collSelectionMap]);

  const toggleCollSelection = (value: Erc721CollectionOffer) => {
    if (!isCollSelected(value)) {
      const copy = new Map(collSelectionMap);
      copy.set(getCollectionKeyId(value), value);

      setCollSelectionMap(copy);
    } else {
      removeCollFromSelection(value);
    }
  };

  const isCollSelectable = (value: Erc721CollectionOffer): boolean => {
    return value.address !== null;
  };

  const removeCollFromSelection = (value?: Erc721CollectionOffer) => {
    if (value) {
      if (isCollSelected(value)) {
        const copy = new Map(collSelectionMap);
        copy.delete(getCollectionKeyId(value));

        setCollSelectionMap(copy);
      }
    } else {
      setCollSelectionMap(new Map());
    }
  };

  const isCollSelected = (value: Erc721CollectionOffer): boolean => {
    return collSelectionMap.has(getCollectionKeyId(value));
  };

  const clearCollSelection = () => {
    setCollSelectionMap(new Map());
  };

  return {
    collSelection,
    isCollSelected,
    isCollSelectable,
    clearCollSelection,
    toggleCollSelection,
    removeCollFromSelection
  };
};
