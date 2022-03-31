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

  const addBuyOrder = (order: OBOrder) => {
    console.log('addOrder');
    console.log(JSON.stringify(order));

    setBuyOrders([...buyOrders, order]);
  };

  const addSellOrder = (order: OBOrder) => {
    console.log('addSellOrder');
    console.log(JSON.stringify(order));

    setSellOrders([...buyOrders, order]);
  };

  const addBuyCartItem = (item: OrderCartItem) => {
    console.log('addBuyCartItem');
    console.log(JSON.stringify(item));

    setBuyCartItems([...buyCartItems, item]);
  };

  const addSellCartItem = (item: OrderCartItem) => {
    console.log('addSellCartItem');
    console.log(JSON.stringify(item));

    setSellCartItems([...sellCartItems, item]);
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
    sellCartItems
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext(): OrderContextType {
  return useContext(OrderContext) as OrderContextType;
}
