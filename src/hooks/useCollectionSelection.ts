import { useEffect, useState } from 'react';
import { getCollectionKeyId } from 'src/utils';
import { useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem } from 'src/utils/types';

interface CollectionSelectionResult {
  toggleCollSelection: (data: ERC721CollectionCartItem) => void;
  isCollSelected: (data: ERC721CollectionCartItem) => boolean;
  isCollSelectable: (data: ERC721CollectionCartItem) => boolean;
  removeCollFromSelection: (data: ERC721CollectionCartItem) => void;
  collSelection: ERC721CollectionCartItem[];
  clearCollSelection: () => void;
}

export const useCollectionSelection = (): CollectionSelectionResult => {
  const [collSelectionMap, setCollSelectionMap] = useState<Map<string, ERC721CollectionCartItem>>(new Map());
  const [collSelection, setCollSelection] = useState<ERC721CollectionCartItem[]>([]);
  const { cartType, setCartItemsForCartType } = useCartContext();

  useEffect(() => {
    setCollSelection(Array.from(collSelectionMap.values()));
    setCartItemsForCartType(cartType, Array.from(collSelectionMap.values()));
  }, [collSelectionMap]);

  const toggleCollSelection = (value: ERC721CollectionCartItem) => {
    if (!isCollSelected(value)) {
      const copy = new Map(collSelectionMap);
      copy.set(getCollectionKeyId(value), value);
      setCollSelectionMap(copy);
    } else {
      removeCollFromSelection(value);
    }
  };

  const removeCollFromSelection = (value: ERC721CollectionCartItem) => {
    if (isCollSelected(value)) {
      const copy = new Map(collSelectionMap);
      copy.delete(getCollectionKeyId(value));
      setCollSelectionMap(copy);
    }
  };

  const clearCollSelection = () => {
    setCollSelectionMap(new Map());
  };

  const isCollSelectable = (value: ERC721CollectionCartItem): boolean => {
    return value.address !== null;
  };

  const isCollSelected = (value: ERC721CollectionCartItem): boolean => {
    return collSelectionMap.has(getCollectionKeyId(value));
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
