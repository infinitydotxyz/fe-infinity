import { useEffect, useState } from 'react';
import { getTokenCartItemKey } from 'src/utils';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721TokenCartItem } from 'src/utils/types';

interface NFTSelectionResult {
  toggleNFTSelection: (data: ERC721TokenCartItem) => void;
  isNFTSelected: (data: ERC721TokenCartItem) => boolean;
  isNFTSelectable: (data: ERC721TokenCartItem) => boolean;
  removeNFTFromSelection: (data: ERC721TokenCartItem) => void;
  nftSelection: ERC721TokenCartItem[];
  clearNFTSelection: () => void;
}

export const useNFTSelection = (): NFTSelectionResult => {
  const [nftSelectionMap, setNFTSelectionMap] = useState<Map<CartType, Map<string, ERC721TokenCartItem>>>(new Map());
  const [nftSelection, setNFTSelection] = useState<ERC721TokenCartItem[]>([]);
  const { cartType, getCurrentCartItems, setCartItemsForCartType } = useCartContext();

  useEffect(() => {
    const cartTypeSelection = nftSelectionMap.get(cartType) ?? new Map();
    setNFTSelection(Array.from(cartTypeSelection.values()));
    setCartItemsForCartType(cartType, Array.from(cartTypeSelection.values()));
  }, [nftSelectionMap]);

  const toggleNFTSelection = (value: ERC721TokenCartItem) => {
    if (!isNFTSelected(value)) {
      const copy = new Map(nftSelectionMap.get(cartType));
      const copy2 = new Map(nftSelectionMap);

      copy.set(getTokenCartItemKey(value), value);
      copy2.set(cartType, copy);

      setNFTSelectionMap(copy2);
    } else {
      removeNFTFromSelection(value);
    }
  };

  const removeNFTFromSelection = (value: ERC721TokenCartItem) => {
    if (isNFTSelected(value)) {
      const copy = new Map(nftSelectionMap.get(cartType));
      const copy2 = new Map(nftSelectionMap);

      copy.delete(getTokenCartItemKey(value));
      copy2.set(cartType, copy);

      setNFTSelectionMap(copy2);
    }
  };

  const clearNFTSelection = () => {
    const items = getCurrentCartItems();
    const copy = new Map(nftSelectionMap.get(cartType));
    const copy2 = new Map(nftSelectionMap);

    for (const item of items) {
      const value = item as ERC721TokenCartItem;
      if (isNFTSelected(value)) {
        copy.delete(getTokenCartItemKey(value));
      }
    }

    copy2.set(cartType, copy);
    setNFTSelectionMap(copy2);
  };

  const isNFTSelectable = (value: ERC721TokenCartItem): boolean => {
    return value.address !== null;
  };

  const isNFTSelected = (value: ERC721TokenCartItem): boolean => {
    return nftSelectionMap.get(cartType)?.has(getTokenCartItemKey(value)) ?? false;
  };

  return {
    nftSelection,
    isNFTSelected,
    isNFTSelectable,
    clearNFTSelection,
    toggleNFTSelection,
    removeNFTFromSelection
  };
};
