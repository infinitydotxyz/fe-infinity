import { useEffect, useState } from 'react';
import { useCartContext } from 'src/utils/context/CartContext';
import { ERC721OrderCartItem } from 'src/utils/types';

interface OrderSelectionResult {
  toggleOrderSelection: (data: ERC721OrderCartItem) => void;
  isOrderSelected: (data: ERC721OrderCartItem) => boolean;
  removeOrderFromSelection: (data: ERC721OrderCartItem) => void;
  orderSelection: ERC721OrderCartItem[];
  clearOrderSelection: () => void;
}

export const useOrderSelection = (): OrderSelectionResult => {
  const [orderSelectionMap, setOrderSelectionMap] = useState<Map<string, ERC721OrderCartItem>>(new Map());
  const [orderSelection, setOrderSelection] = useState<ERC721OrderCartItem[]>([]);
  const { cartType, cartItems, setCartItems } = useCartContext();

  useEffect(() => {
    setOrderSelection(Array.from(orderSelectionMap.values()));
    const otherTypeCartItems = cartItems.filter((cartItem) => cartItem.cartType !== cartType);
    setCartItems(otherTypeCartItems.concat(Array.from(orderSelectionMap.values())));
  }, [orderSelectionMap]);

  const toggleOrderSelection = (value: ERC721OrderCartItem) => {
    if (!isOrderSelected(value)) {
      const copy = new Map(orderSelectionMap);
      copy.set(value.id, value);
      setOrderSelectionMap(copy);
    } else {
      removeOrderFromSelection(value);
    }
  };

  const removeOrderFromSelection = (value: ERC721OrderCartItem) => {
    if (isOrderSelected(value)) {
      const copy = new Map(orderSelectionMap);
      copy.delete(value.id);
      setOrderSelectionMap(copy);
    }
  };

  const clearOrderSelection = () => {
    setOrderSelectionMap(new Map());
  };

  const isOrderSelected = (value: ERC721OrderCartItem): boolean => {
    return orderSelectionMap.has(value.id);
  };

  return {
    orderSelection,
    isOrderSelected,
    clearOrderSelection,
    toggleOrderSelection,
    removeOrderFromSelection
  };
};
