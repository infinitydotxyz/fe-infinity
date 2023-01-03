import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';

interface OrderSelectionResult {
  toggleOrderSelection: (data: SignedOBOrder) => void;
  isOrderSelected: (data: SignedOBOrder) => boolean;
  removeOrderFromSelection: (data?: SignedOBOrder) => void; // null to remove all
  orderSelection: SignedOBOrder[];
  clearOrderSelection: () => void;
}

export const useOrderSelection = (): OrderSelectionResult => {
  const [orderSelectionMap, setOrderSelectionMap] = useState<Map<string, SignedOBOrder>>(new Map());
  const [orderSelection, setOrderSelection] = useState<SignedOBOrder[]>([]);

  useEffect(() => {
    setOrderSelection(Array.from(orderSelectionMap.values()));
  }, [orderSelectionMap]);

  const toggleOrderSelection = (value: SignedOBOrder) => {
    if (!isOrderSelected(value)) {
      const copy = new Map(orderSelectionMap);
      copy.set(value.id, value);

      setOrderSelectionMap(copy);
    } else {
      removeOrderFromSelection(value);
    }
  };

  const removeOrderFromSelection = (value?: SignedOBOrder) => {
    if (value) {
      if (isOrderSelected(value)) {
        const copy = new Map(orderSelectionMap);
        copy.delete(value.id);

        setOrderSelectionMap(copy);
      }
    } else {
      setOrderSelectionMap(new Map());
    }
  };

  const isOrderSelected = (value: SignedOBOrder): boolean => {
    return orderSelectionMap.has(value.id);
  };

  const clearOrderSelection = () => {
    setOrderSelectionMap(new Map());
  };

  return {
    orderSelection,
    isOrderSelected,
    clearOrderSelection,
    toggleOrderSelection,
    removeOrderFromSelection
  };
};
