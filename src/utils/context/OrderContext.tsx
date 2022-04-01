import { OBOrder } from '@infinityxyz/lib/types/core';
import React, { ReactNode, useContext, useState } from 'react';

export interface OrderCartItem {
  tokenName: string;
  collectionName: string;
  imageUrl: string;
}

export const isCartItemEqual = (a: OrderCartItem, b: OrderCartItem): boolean => {
  return a.tokenName === b.tokenName && a.collectionName === b.collectionName;
};

export const indexOfCartItem = (list: OrderCartItem[], item: OrderCartItem): number => {
  for (let i = 0; i < list.length; i++) {
    if (isCartItemEqual(item, list[i])) {
      return i;
    }
  }

  return -1;
};

export type OrderContextType = {
  orderDrawerOpen: boolean;
  setOrderDrawerOpen: (flag: boolean) => void;

  buyOrders: OBOrder[];
  sellOrders: OBOrder[];
  addBuyOrder: (order: OBOrder) => void;
  addSellOrder: (order: OBOrder) => void;

  buyCartItems: OrderCartItem[];
  sellCartItems: OrderCartItem[];

  addBuyCartItem: (order: OrderCartItem) => void;
  addSellCartItem: (order: OrderCartItem) => void;

  removeBuyCartItem: (order: OrderCartItem) => void;
  removeSellCartItem: (order: OrderCartItem) => void;
  clearCartItems: () => void;

  isOrderEmpty: () => boolean;
  isCartEmpty: () => boolean;
  isOrderBuilderEmpty: () => boolean;
};

const OrderContext = React.createContext<OrderContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [orderDrawerOpen, setOrderDrawerOpen] = useState<boolean>(false);

  const [buyOrders, setBuyOrders] = useState<OBOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<OBOrder[]>([]);
  const [buyCartItems, setBuyCartItems] = useState<OrderCartItem[]>([]);
  const [sellCartItems, setSellCartItems] = useState<OrderCartItem[]>([]);

  const isOrderBuilderEmpty = (): boolean => {
    return buyCartItems.length === 0 && sellCartItems.length === 0;
  };

  const isCartEmpty = (): boolean => {
    return sellOrders.length === 0 && buyOrders.length === 0;
  };

  // used to show the drawer button
  const isOrderEmpty = (): boolean => {
    return isOrderBuilderEmpty() && isCartEmpty();
  };

  const addBuyOrder = (order: OBOrder) => {
    setBuyOrders([...buyOrders, order]);
  };

  const addSellOrder = (order: OBOrder) => {
    setSellOrders([...buyOrders, order]);
  };

  const addBuyCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(buyCartItems, item);

    if (index === -1) {
      setBuyCartItems([...buyCartItems, item]);
    }
  };

  const addSellCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(sellCartItems, item);

    if (index === -1) {
      setSellCartItems([...sellCartItems, item]);
    }
  };

  const removeBuyCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(buyCartItems, item);

    if (index !== -1) {
      const copy = [...buyCartItems];
      copy.splice(index, 1);

      setBuyCartItems(copy);
    }
  };

  const clearCartItems = () => {
    setBuyCartItems([]);
    setSellCartItems([]);
  };

  const removeSellCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(sellCartItems, item);

    if (index !== -1) {
      const copy = [...sellCartItems];
      copy.splice(index, 1);

      setSellCartItems(copy);
    }
  };

  const value: OrderContextType = {
    orderDrawerOpen,
    setOrderDrawerOpen,
    addBuyOrder,
    addSellOrder,
    buyOrders,
    sellOrders,
    addBuyCartItem,
    addSellCartItem,
    buyCartItems,
    sellCartItems,
    removeSellCartItem,
    removeBuyCartItem,
    isCartEmpty,
    isOrderBuilderEmpty,
    isOrderEmpty,
    clearCartItems
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext(): OrderContextType {
  return useContext(OrderContext) as OrderContextType;
}
