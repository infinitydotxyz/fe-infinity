import { Erc721Collection } from '@infinityxyz/lib-frontend/types/core/Collection';
import { useEffect, useState } from 'react';
import { getCollectionId } from 'src/utils';

interface CollectionSelectionResult {
  toggleCollSelection: (data: Erc721Collection) => void;
  isCollSelected: (data: Erc721Collection) => boolean;
  isCollSelectable: (data: Erc721Collection) => boolean;
  removeCollFromSelection: (data?: Erc721Collection) => void; // null to remove all
  collSelection: Erc721Collection[];
  clearCollSelection: () => void;
}

export const useCollectionSelection = (): CollectionSelectionResult => {
  const [collSelectionMap, setCollSelectionMap] = useState<Map<string, Erc721Collection>>(new Map());
  const [collSelection, setCollSelection] = useState<Erc721Collection[]>([]);

  useEffect(() => {
    setCollSelection(Array.from(collSelectionMap.values()));
  }, [collSelectionMap]);

  const toggleCollSelection = (value: Erc721Collection) => {
    if (!isCollSelected(value)) {
      const copy = new Map(collSelectionMap);
      copy.set(getCollectionId(value), value);

      setCollSelectionMap(copy);
    } else {
      removeCollFromSelection(value);
    }
  };

  const isCollSelectable = (value: Erc721Collection): boolean => {
    return value.address !== null;
  };

  const removeCollFromSelection = (value?: Erc721Collection) => {
    if (value) {
      if (isCollSelected(value)) {
        const copy = new Map(collSelectionMap);
        copy.delete(getCollectionId(value));

        setCollSelectionMap(copy);
      }
    } else {
      setCollSelectionMap(new Map());
    }
  };

  const isCollSelected = (value: Erc721Collection): boolean => {
    return collSelectionMap.has(getCollectionId(value));
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
