import { useEffect, useState } from 'react';
import { getTokenCartItemKey } from 'src/utils';
import { useCartContext } from 'src/utils/context/CartContext';
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
  const [nftSelectionMap, setNFTSelectionMap] = useState<Map<string, ERC721TokenCartItem>>(new Map());
  const [nftSelection, setNFTSelection] = useState<ERC721TokenCartItem[]>([]);
  const { cartType, setCartItems } = useCartContext();

  useEffect(() => {
    setNFTSelection(Array.from(nftSelectionMap.values()));
    setCartItems(Array.from(nftSelectionMap.values()));
  }, [nftSelectionMap]);

  const toggleNFTSelection = (value: ERC721TokenCartItem) => {
    value.cartType = cartType;
    if (!isNFTSelected(value)) {
      const copy = new Map(nftSelectionMap);
      copy.set(getTokenCartItemKey(value), value);
      setNFTSelectionMap(copy);
    } else {
      removeNFTFromSelection(value);
    }
  };

  const removeNFTFromSelection = (value: ERC721TokenCartItem) => {
    if (isNFTSelected(value)) {
      const copy = new Map(nftSelectionMap);
      copy.delete(getTokenCartItemKey(value));
      setNFTSelectionMap(copy);
    }
  };

  const clearNFTSelection = () => {
    setNFTSelectionMap(new Map());
  };

  const isNFTSelectable = (value: ERC721TokenCartItem): boolean => {
    return value.address !== null;
  };

  const isNFTSelected = (value: ERC721TokenCartItem): boolean => {
    return nftSelectionMap.has(getTokenCartItemKey(value));
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
