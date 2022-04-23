import { OBOrderItem, OBOrder, SignedOBOrder } from '@infinityxyz/lib/types/core';
import React, { ReactNode, useContext, useState } from 'react';
import { useAppContext } from './AppContext';
import { secondsPerDay } from 'src/components/market/order-drawer/ui-constants';
import { getSignedOBOrder } from '../exchange/orders';
import { postOrders } from '../marketUtils';
import {
  error,
  getExchangeAddress,
  getOBComplicationAddress,
  getOrderId,
  getOrderNonce,
  getTxnCurrencyAddress,
  NULL_HASH
} from '@infinityxyz/lib/utils';

export interface OrderCartItem {
  isSellOrder: boolean;
  tokenImage?: string;
  tokenName?: string;
  tokenId?: string;
  collectionName: string;
  collectionAddress: string;
  collectionImage?: string;
  numTokens?: number;
}

export interface OrderInCart {
  id: number;
  cartItems: OrderCartItem[];
  order: OBOrder;
}

const isCartItemEqual = (a: OrderCartItem, b: OrderCartItem): boolean => {
  return (
    a.tokenName === b.tokenName &&
    a.collectionName === b.collectionName &&
    a.collectionAddress === b.collectionAddress &&
    a.isSellOrder === b.isSellOrder &&
    a.tokenImage === b.tokenImage
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

  executeOrder: () => Promise<boolean>;

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
  const { showAppError, user, providerManager, chainId } = useAppContext();

  const isOrderBuilderEmpty = (): boolean => {
    return cartItems.length === 0;
  };

  const readyToCheckout = () => {
    return !isCartEmpty() && isOrderBuilderEmpty();
  };

  const getItems = (): OBOrderItem[] => {
    const items: OBOrderItem[] = [];

    for (const cartItem of cartItems) {
      items.push({
        collectionAddress: cartItem.collectionAddress,
        collectionName: cartItem.collectionName,
        collectionImage: cartItem.collectionImage ?? '',
        tokens:
          cartItem.tokenId !== undefined
            ? [
                {
                  tokenId: cartItem.tokenId ?? 0,
                  tokenName: cartItem.tokenName ?? '',
                  tokenImage: cartItem.tokenImage ?? '',
                  numTokens: cartItem.numTokens ?? 1,
                  takerAddress: '',
                  takerUsername: '' // todo: change this
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
      setPrice(orderInCart.order.startPriceEth);
      setExpirationDate(orderInCart.order.endTimeMs);
      setNumItems(orderInCart.order.numItems);
    }
  };

  const addOrderToCart = () => {
    setIsEditingOrder(false);

    if (!user || !user.address) {
      error('user is null');
      return;
    }

    // todo: put in missing values
    const orderNonce = getOrderNonce(user.address, chainId);
    const order: OBOrder = {
      id: '',
      chainId: chainId,
      isSellOrder: isSellOrderCart(),
      makerAddress: user?.address ?? '????',
      numItems,
      startTimeMs: Date.now(),
      endTimeMs: expirationDate,
      startPriceEth: price,
      endPriceEth: price,
      nfts: getItems(),
      makerUsername: '',
      nonce: orderNonce,
      minBpsToSeller: 9000,
      execParams: {
        currencyAddress: getTxnCurrencyAddress(chainId),
        complicationAddress: getOBComplicationAddress(chainId)
      },
      extraParams: {
        buyer: ''
      }
    };

    const orderId = getOrderId(chainId, getExchangeAddress(chainId), order);
    if (orderId === NULL_HASH) {
      error('orderId is null');
      return;
    }

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

  const executeOrder = async (): Promise<boolean> => {
    if (!user) {
      showAppError('You must be logged in to execute an order');
      return false;
    }
    if (!providerManager) {
      showAppError('Provider manager not found');
      return false;
    }
    const signer = providerManager.getEthersProvider().getSigner();
    setOrderDrawerOpen(false);

    // sign orders
    const signedOrders: SignedOBOrder[] = [];
    for (const orderInCart of ordersInCart) {
      const order = await getSignedOBOrder(user, chainId, signer, orderInCart.order);
      if (order) {
        signedOrders.push(order);
      }
    }

    // post orders
    await postOrders(user.address, signedOrders);

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
