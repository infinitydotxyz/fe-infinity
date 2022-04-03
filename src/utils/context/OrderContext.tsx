import { OBOrder } from '@infinityxyz/lib/types/core';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { BigNumberish } from 'ethers';
import React, { ReactNode, useContext, useState } from 'react';

export interface OrderCartItem {
  isSellOrder: boolean;
  imageUrl: string;
  tokenName?: string;
  tokenId?: string;
  collectionName: string;
  collectionAddress: string;
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

  order?: OBOrder;
  setOrder: (order?: OBOrder) => void;

  buyCartItems: OrderCartItem[];
  sellCartItems: OrderCartItem[];

  addBuyCartItem: (order: OrderCartItem) => void;
  addSellCartItem: (order: OrderCartItem) => void;

  removeBuyCartItem: (order: OrderCartItem) => void;
  removeSellCartItem: (order: OrderCartItem) => void;

  isOrderStateEmpty: () => boolean;
  isCartEmpty: () => boolean;
  isOrderBuilderEmpty: () => boolean;

  isSellOrder: () => boolean;

  executeOrder: () => void;

  // drawer form
  startPrice: BigNumberish;
  setStartPrice: (price: BigNumberish) => void;
  endPrice: BigNumberish;
  setEndPrice: (price: BigNumberish) => void;
  startTime: BigNumberish;
  setStartTime: (time: BigNumberish) => void;
  endTime: BigNumberish;
  setEndTime: (time: BigNumberish) => void;
  numItems: BigNumberish;
  setNumItems: (items: BigNumberish) => void;
};

const OrderContext = React.createContext<OrderContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [orderDrawerOpen, setOrderDrawerOpen] = useState<boolean>(false);

  const [order, setOrder] = useState<OBOrder>();
  const [buyCartItems, setBuyCartItems] = useState<OrderCartItem[]>([]);
  const [sellCartItems, setSellCartItems] = useState<OrderCartItem[]>([]);

  // drawer form
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
  const [numItems, setNumItems] = useState<BigNumberish>(1);

  const isOrderBuilderEmpty = (): boolean => {
    return buyCartItems.length === 0 && sellCartItems.length === 0;
  };

  const isCartEmpty = (): boolean => {
    return order === undefined;
  };

  // used to show the drawer button
  const isOrderStateEmpty = (): boolean => {
    return isOrderBuilderEmpty() && isCartEmpty();
  };

  // the drawer can be in sell or buy mode depending on the items added
  const isSellOrder = (): boolean => {
    return sellCartItems.length > 0;
    // return buyCartItems.length > 0;
  };

  const executeOrder = () => {
    setBuyCartItems([]);
    setSellCartItems([]);
    setOrder(undefined);
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
    order,
    setOrder,
    addBuyCartItem,
    addSellCartItem,
    buyCartItems,
    sellCartItems,
    removeSellCartItem,
    removeBuyCartItem,
    isCartEmpty,
    isOrderBuilderEmpty,
    isOrderStateEmpty,
    isSellOrder,
    executeOrder,
    startPrice,
    setStartPrice,
    endPrice,
    setEndPrice,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    numItems,
    setNumItems
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext(): OrderContextType {
  return useContext(OrderContext) as OrderContextType;
}
