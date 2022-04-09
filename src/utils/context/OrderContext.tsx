import { OBOrder } from '@infinityxyz/lib/types/core';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { BigNumberish } from 'ethers';
import React, { ReactNode, useContext, useState } from 'react';
import { useAppContext } from './AppContext';
import { addBuy, addSell } from 'src/utils/marketUtils';
import { thirtyDaySeconds } from 'src/components/market/order-drawer/ui-constants';

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
  price: BigNumberish;
  setPrice: (price: BigNumberish) => void;
  expirationDate: BigNumberish;
  setExpirationDate: (time: BigNumberish) => void;
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
  const [price, setPrice] = useState<BigNumberish>(1);
  const [expirationDate, setExpirationDate] = useState<BigNumberish>(nowSeconds().add(thirtyDaySeconds));
  const [numItems, setNumItems] = useState<BigNumberish>(1);

  // for executing orders
  const { showAppError, showAppMessage, user, providerManager } = useAppContext();

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

    if (isSellOrderCart()) {
      executeSell();
    } else {
      executeBuy();
    }

    _resetStateValues();

    return true;
  };

  const _resetStateValues = () => {
    setOrder(undefined);
    setCartItems([]);
    setPrice(1);
    setExpirationDate(nowSeconds().add(thirtyDaySeconds));
    setNumItems(1);
  };

  const addCartItem = (item: OrderCartItem) => {
    if (isSellOrderCart() !== item.isSellOrder) {
      setCartItems([item]);
      setOrder(undefined);
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

  // ===============================================================

  const executeBuy = async () => {
    if (!user || !providerManager) {
      console.error('no user or provider');
      return;
    }
    if (order) {
      // crashes
      // const signer = providerManager.getEthersProvider().getSigner();
      // await prepareOBOrder(user, chainId, signer, order);

      const match = await addBuy(order);

      if (match) {
        console.log(match);

        showAppMessage('Buy successful');
      } else {
        showAppError('Buy submitted');
      }
    }
  };

  const executeSell = async () => {
    if (order) {
      const match = await addSell(order);
      if (match) {
        console.log(match);
        showAppMessage('sell successful.');
      } else {
        showAppMessage('sell submitted');
      }
    }
  };

  // ===============================================================

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
    price,
    setPrice,
    expirationDate,
    setExpirationDate,
    numItems,
    setNumItems
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrderContext(): OrderContextType {
  return useContext(OrderContext) as OrderContextType;
}
