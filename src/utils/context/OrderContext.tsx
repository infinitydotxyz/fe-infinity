import { OBOrderSpecNFT, OBOrderSpec } from '@infinityxyz/lib/types/core';
import React, { ReactNode, useContext, useState } from 'react';
import { useAppContext } from './AppContext';
import { addBuy, addSell } from 'src/utils/marketUtils';
import { secondsPerDay } from 'src/components/market/order-drawer/ui-constants';

export interface OrderCartItem {
  isSellOrder: boolean;
  imageUrl?: string;
  tokenName?: string;
  tokenId?: number;
  collectionName: string;
  collectionAddress: string;
  profileImage?: string;
}

export interface OrderInCart {
  id: number;
  cartItems: OrderCartItem[];
  order: OBOrderSpec;
}

const isCartItemEqual = (a: OrderCartItem, b: OrderCartItem): boolean => {
  return (
    a.tokenName === b.tokenName &&
    a.collectionName === b.collectionName &&
    a.collectionAddress === b.collectionAddress &&
    a.isSellOrder === b.isSellOrder &&
    a.imageUrl === b.imageUrl
  );
};

const indexOfCartItem = (list: OrderCartItem[], item: OrderCartItem): number => {
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

  ordersInCart: OrderInCart[];
  editOrderFromCart: (id: number) => void;
  isEditingOrder: boolean;
  addOrderToCart: () => void;

  cartItems: OrderCartItem[];
  addCartItem: (order: OrderCartItem) => void;
  removeCartItem: (order: OrderCartItem) => void;

  isOrderStateEmpty: () => boolean;
  readyToCheckout: () => boolean;
  isOrderBuilderEmpty: () => boolean;

  isSellOrderCart: () => boolean;

  executeOrder: () => boolean;

  // drawer form
  price: number;
  setPrice: (price: number) => void;
  expirationDate: number;
  setExpirationDate: (time: number) => void;
  numItems: number;
  setNumItems: (items: number) => void;
};

const OrderContext = React.createContext<OrderContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function OrderContextProvider({ children }: Props) {
  const [orderDrawerOpen, setOrderDrawerOpen] = useState<boolean>(false);
  const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);

  const [ordersInCart, setOrdersInCart] = useState<OrderInCart[]>([]);

  const [cartItems, setCartItems] = useState<OrderCartItem[]>([]);

  // drawer form
  const [price, setPrice] = useState<number>(1);
  const [expirationDate, setExpirationDate] = useState<number>(Date.now() + secondsPerDay * 30 * 1000);
  const [numItems, setNumItems] = useState<number>(1);

  // for executing orders
  const { showAppError, showAppMessage, user, providerManager, chainId } = useAppContext();

  const isOrderBuilderEmpty = (): boolean => {
    return cartItems.length === 0;
  };

  const readyToCheckout = () => {
    return !isCartEmpty() && isOrderBuilderEmpty();
  };

  const getItems = (): OBOrderSpecNFT[] => {
    const items: OBOrderSpecNFT[] = [];

    for (const cartItem of cartItems) {
      items.push({
        collectionAddress: cartItem.collectionAddress,
        collectionName: cartItem.collectionName,
        profileImage: cartItem.profileImage ?? '',
        tokens:
          cartItem.tokenId !== undefined
            ? [
                {
                  tokenId: cartItem.tokenId ?? 0,
                  tokenName: cartItem.tokenName ?? '',
                  imageUrl: cartItem.imageUrl ?? ''
                }
              ]
            : []
      });
    }

    return items;
  };

  const indexOfOrderInCart = (id: number): number => {
    for (let i = 0; i < ordersInCart.length; i++) {
      if (ordersInCart[i].id === id) {
        return i;
      }
    }

    return -1;
  };

  const editOrderFromCart = (id: number) => {
    const index = indexOfOrderInCart(id);

    if (index != -1) {
      const orderInCart = ordersInCart[index];

      setIsEditingOrder(true);

      if (index !== -1) {
        const copy = [...ordersInCart];
        copy.splice(index, 1);

        setOrdersInCart(copy);
      }

      setCartItems(orderInCart.cartItems);
      setPrice(orderInCart.order.startPrice);
      setExpirationDate(orderInCart.order.endTime);
      setNumItems(orderInCart.order.numItems);
    }
  };

  const addOrderToCart = () => {
    setIsEditingOrder(false);

    const order: OBOrderSpec = {
      id: '????',
      chainId: parseInt(chainId),
      isSellOrder: isSellOrderCart(),
      signerAddress: user?.address ?? '????',
      numItems,
      startTime: Date.now(),
      endTime: expirationDate,
      startPrice: price,
      endPrice: price,
      nfts: getItems()
    };

    const orderInCart: OrderInCart = {
      id: Math.random(),
      order: order,
      cartItems: cartItems
    };

    setOrdersInCart([...ordersInCart, orderInCart]);

    setCartItems([]);
  };

  const isCartEmpty = (): boolean => {
    return ordersInCart.length === 0;
  };

  // used to show the drawer button
  const isOrderStateEmpty = (): boolean => {
    return isOrderBuilderEmpty() && isCartEmpty();
  };

  // the drawer can be in sell or buy mode depending on the items added
  const isSellOrderCart = (): boolean => {
    if (ordersInCart.length > 0) {
      return ordersInCart[0].order.isSellOrder;
    }

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
    setOrdersInCart([]);
    setCartItems([]);
    setPrice(1);
    setExpirationDate(Date.now() + secondsPerDay * 30 * 1000);
    setNumItems(1);
    setIsEditingOrder(false);
  };

  const addCartItem = (item: OrderCartItem) => {
    if (isSellOrderCart() !== item.isSellOrder) {
      setCartItems([item]);
      setOrdersInCart([]);
    } else {
      const index = indexOfCartItem(cartItems, item);

      if (index === -1) {
        setCartItems([...cartItems, item]);
      }
    }

    setOrderDrawerOpen(true);
  };

  const removeCartItem = (item: OrderCartItem) => {
    const index = indexOfCartItem(cartItems, item);

    if (index !== -1) {
      const copy = [...cartItems];
      copy.splice(index, 1);

      // we have cleared out the items, so the next item added will be an add, not an update
      if (copy.length === 0) {
        setIsEditingOrder(false);
      }

      setCartItems(copy);
    }
  };

  // ===============================================================

  const executeBuy = async () => {
    if (!user || !providerManager) {
      console.error('no user or provider');
      return;
    }
    if (ordersInCart.length > 0) {
      for (const orderInCart of ordersInCart) {
        // crashes
        // const signer = providerManager.getEthersProvider().getSigner();
        // await prepareOBOrder(user, chainId, signer, order);

        const match = await addBuy(orderInCart.order);

        if (match) {
          showAppMessage('Buy successful');
        } else {
          showAppError('Buy submitted');
        }
      }
    }
  };

  const executeSell = async () => {
    if (ordersInCart.length > 0) {
      for (const orderInCart of ordersInCart) {
        const match = await addSell(orderInCart.order);
        if (match) {
          showAppMessage('sell successful.');
        } else {
          showAppMessage('sell submitted');
        }
      }
    }
  };

  // ===============================================================

  const value: OrderContextType = {
    orderDrawerOpen,
    setOrderDrawerOpen,
    isEditingOrder,
    ordersInCart,
    addOrderToCart,
    editOrderFromCart,
    addCartItem,
    cartItems,
    removeCartItem,
    readyToCheckout,
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
