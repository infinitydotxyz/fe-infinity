import { OBOrder } from '@infinityxyz/lib/types/core';
import React, { ReactNode, useContext, useState } from 'react';
import { OrderCartItem } from 'src/components/market/order-drawer';

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

  isCartEmpty: () => boolean;
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

  const isCartEmpty = (): boolean => {
    return buyCartItems.length === 0 && sellCartItems.length === 0;
  };

  const addBuyOrder = (order: OBOrder) => {
    setBuyOrders([...buyOrders, order]);
  };

  const addSellOrder = (order: OBOrder) => {
    setSellOrders([...buyOrders, order]);
  };

  const addBuyCartItem = (item: OrderCartItem) => {
    setBuyCartItems([...buyCartItems, item]);
  };

  const addSellCartItem = (item: OrderCartItem) => {
    setSellCartItems([...sellCartItems, item]);
  };

  const removeBuyCartItem = (item: OrderCartItem) => {
    const newItems = buyCartItems.filter((e) => {
      return e.tokenName !== item.tokenName || e.collectionName !== item.collectionName;
    });

    setBuyCartItems(newItems);
  };

  const removeSellCartItem = (item: OrderCartItem) => {
    const newItems = sellCartItems.filter((e) => {
      return e.tokenName !== item.tokenName || e.collectionName !== item.collectionName;
    });

    setSellCartItems(newItems);
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
    isCartEmpty
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext(): OrderContextType {
  return useContext(OrderContext) as OrderContextType;
}
