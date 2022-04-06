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

  cartItems: OrderCartItem[];
  addCartItem: (order: OrderCartItem) => void;
  removeCartItem: (order: OrderCartItem) => void;

  isOrderStateEmpty: () => boolean;
  isCartEmpty: () => boolean;
  isOrderBuilderEmpty: () => boolean;

  isSellOrderCart: () => boolean;

  executeOrder: () => boolean;

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
  const [cartItems, setCartItems] = useState<OrderCartItem[]>([]);

  // drawer form
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
  const [numItems, setNumItems] = useState<BigNumberish>(1);

  const isOrderBuilderEmpty = (): boolean => {
    return cartItems.length === 0;
  };

  const isCartEmpty = (): boolean => {
    return order === undefined;
  };

  // used to show the drawer button
  const isOrderStateEmpty = (): boolean => {
    return isOrderBuilderEmpty() && isCartEmpty();
  };

  // the drawer can be in sell or buy mode depending on the items added
  const isSellOrderCart = (): boolean => {
    if (cartItems.length > 0) {
      return cartItems[0].isSellOrder;
    }

    return false;
  };

  const executeOrder = (): boolean => {
    setOrderDrawerOpen(false);

    _resetStateValues();

    return true;
  };

  const _resetStateValues = () => {
    setOrder(undefined);
    setCartItems([]);
    setStartPrice(1);
    setEndPrice(1);
    setStartTime(nowSeconds());
    setEndTime(nowSeconds().add(1000));
    setNumItems(1);
  };

  const addCartItem = (item: OrderCartItem) => {
    if (isSellOrderCart() !== item.isSellOrder) {
      setCartItems([item]);
    } else {
      const index = indexOfCartItem(cartItems, item);

      if (index === -1) {
        setCartItems([...cartItems, item]);
      }
    }
  };

  const removeCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(cartItems, item);

    if (index !== -1) {
      const copy = [...cartItems];
      copy.splice(index, 1);

      setCartItems(copy);
    }
  };

  const value: OrderContextType = {
    orderDrawerOpen,
    setOrderDrawerOpen,
    order,
    setOrder,
    addCartItem,
    cartItems,
    removeCartItem,
    isCartEmpty,
    isOrderBuilderEmpty,
    isOrderStateEmpty,
    isSellOrderCart,
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
