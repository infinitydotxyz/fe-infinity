import { OBOrder, OBOrderItem, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { getOBComplicationAddress, getTxnCurrencyAddress, NULL_ADDRESS } from '@infinityxyz/lib-frontend/utils';
import React, { ReactNode, useContext, useState } from 'react';
import { toastError } from 'src/components/common';
import { getSignedOBOrder } from '../exchange/orders';
import { fetchMinBpsToSeller, fetchOrderNonce, postOrders } from '../marketUtils';
import { secondsPerDay } from '../ui-constants';
import { useAppContext } from './AppContext';

export interface OrderCartItem {
  isSellOrder: boolean;
  tokenImage?: string;
  tokenName?: string;
  tokenId?: string;
  collectionName: string;
  collectionAddress: string;
  collectionImage?: string;
  collectionSlug?: string;
  hasBlueCheck?: boolean;
  numTokens?: number;
}

export interface OBOrderSpec {
  chainId: string;
  isSellOrder: boolean;
  numItems: number;
  makerUsername: string;
  makerAddress: string;
  startPriceEth: number;
  endPriceEth: number;
  startTimeMs: number;
  endTimeMs: number;
  nfts: OBOrderItem[];
}

export interface OrderInCart {
  id: number;
  cartItems: OrderCartItem[];
  orderSpec: OBOrderSpec;
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
  cancelOrder: () => void;
  updateOrders: (orderInCart: OrderInCart[]) => void;

  cartItems: OrderCartItem[];
  addCartItem: (order: OrderCartItem) => void;
  removeCartItem: (order: OrderCartItem) => void;
  removeOrder: (order: OrderInCart) => void;
  removeAllOrders: () => void;

  isOrderStateEmpty: () => boolean;
  readyToCheckout: () => boolean;
  isOrderBuilderEmpty: () => boolean;

  isSellOrderCart: () => boolean;
  isCollectionsCart: () => boolean;

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

export const OrderContextProvider = ({ children }: Props) => {
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
        collectionSlug: cartItem?.collectionSlug ?? '',
        hasBlueCheck: cartItem?.hasBlueCheck ?? false,
        tokens:
          cartItem.tokenId !== undefined
            ? [
                {
                  tokenId: cartItem.tokenId ?? 0,
                  tokenName: cartItem.tokenName ?? '',
                  tokenImage: cartItem.tokenImage ?? '',
                  numTokens: cartItem.numTokens ?? 1,
                  takerAddress: '', // takerAddress and username will be filled in the backend
                  takerUsername: ''
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

    if (index !== -1) {
      const orderInCart = ordersInCart[index];

      setIsEditingOrder(true);

      if (index !== -1) {
        const copy = [...ordersInCart];
        copy.splice(index, 1);

        setOrdersInCart(copy);
      }

      setCartItems(orderInCart.cartItems);
      setPrice(orderInCart.orderSpec.startPriceEth);
      setExpirationDate(orderInCart.orderSpec.endTimeMs);
      setNumItems(orderInCart.orderSpec.numItems);
    }
  };

  const cancelOrder = () => {
    if (!user || !user.address) {
      console.error('user is null');
      return;
    }
    setIsEditingOrder(false);
    setCartItems([]);
  };

  const addOrderToCart = () => {
    setIsEditingOrder(false);
    if (!user || !user.address) {
      console.error('user is null');
      return;
    }

    try {
      const nfts = getItems();

      const orderSpec: OBOrderSpec = {
        chainId: chainId,
        isSellOrder: isSellOrderCart(),
        makerAddress: user.address,
        numItems,
        startTimeMs: Date.now(),
        endTimeMs: expirationDate,
        startPriceEth: price,
        endPriceEth: price,
        nfts,
        makerUsername: '' // todo: put in username
      };

      const orderInCart: OrderInCart = {
        id: Math.random(),
        orderSpec: orderSpec,
        cartItems: cartItems
      };

      setOrdersInCart([...ordersInCart, orderInCart]);

      setCartItems([]);
    } catch (err) {
      console.error(err);
      showAppError('Failed constructing order');
      return;
    }
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
      return ordersInCart[0].orderSpec.isSellOrder;
    }

    if (cartItems.length > 0) {
      return cartItems[0].isSellOrder;
    }

    return false;
  };

  const specToOBOrder = async (spec: OBOrderSpec): Promise<OBOrder | undefined> => {
    if (!user || !user.address) {
      console.error('user is null');
      return;
    }

    try {
      const orderNonce = await fetchOrderNonce(user.address);
      const minBpsToSeller = await fetchMinBpsToSeller(chainId, spec.nfts);
      // sell orders are always in ETH
      const currencyAddress = spec.isSellOrder ? NULL_ADDRESS : getTxnCurrencyAddress(chainId);
      const order: OBOrder = {
        id: '',
        chainId: spec.chainId,
        isSellOrder: spec.isSellOrder,
        makerAddress: spec.makerAddress,
        numItems: spec.numItems,
        startTimeMs: spec.startTimeMs,
        endTimeMs: spec.endTimeMs,
        startPriceEth: spec.startPriceEth,
        endPriceEth: spec.endPriceEth,
        nfts: spec.nfts,
        makerUsername: spec.makerUsername,
        nonce: orderNonce,
        minBpsToSeller,
        execParams: {
          currencyAddress,
          complicationAddress: getOBComplicationAddress(chainId)
        },
        extraParams: {
          buyer: ''
        }
      };

      return order;
    } catch (err) {
      console.log(err);
    }
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
    let hasErrors = false;
    const signedOrders: SignedOBOrder[] = [];
    for (const orderInCart of ordersInCart) {
      const order = await specToOBOrder(orderInCart.orderSpec);

      if (order) {
        try {
          const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
          if (signedOrder) {
            signedOrders.push(signedOrder);
          }
        } catch (ex) {
          toastError(ex as string);
          hasErrors = true;
        }
      }
    }
    if (hasErrors) {
      return false;
    }

    // post orders
    try {
      await postOrders(user.address, signedOrders);
    } catch (ex) {
      toastError(ex as string);
      return false;
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
    // if we add a buy to a sell cart, or add a collection to a token cart
    // clear out everything.
    const collectionItem = !item.tokenId;

    if (isSellOrderCart() !== item.isSellOrder || isCollectionsCart() !== collectionItem) {
      setCartItems([item]);
      setOrdersInCart([]);
    } else {
      const index = indexOfCartItem(cartItems, item);

      if (index === -1) {
        setCartItems([...cartItems, item]);
      }
      if (cartItems.length < 1) {
        setOrderDrawerOpen(true); // only show the drawer for the first cart item.
      }
    }

    // setOrderDrawerOpen(true);
  };

  const removeAllOrders = () => {
    _resetStateValues();
  };

  const updateOrders = (orders: OrderInCart[]) => {
    setOrdersInCart([...orders]);
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

  const removeOrder = (order: OrderInCart) => {
    const index = ordersInCart.findIndex((ord) => ord.id === order.id);

    if (index !== -1) {
      const copy = [...ordersInCart];
      copy.splice(index, 1);
      setOrdersInCart(copy);
    }
  };

  // the builder only handles all tokens or all collections
  const isCollectionsCart = () => {
    for (const x of cartItems) {
      if (!x.tokenId) {
        return true;
      }
    }

    return false;
  };

  // ===============================================================

  const value: OrderContextType = {
    orderDrawerOpen,
    setOrderDrawerOpen,
    isEditingOrder,
    ordersInCart,
    addOrderToCart,
    cancelOrder,
    editOrderFromCart,
    addCartItem,
    cartItems,
    removeCartItem,
    removeOrder,
    removeAllOrders,
    updateOrders,
    readyToCheckout,
    isOrderBuilderEmpty,
    isOrderStateEmpty,
    isSellOrderCart,
    isCollectionsCart,
    executeOrder,
    price,
    setPrice,
    expirationDate,
    setExpirationDate,
    numItems,
    setNumItems
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrderContext = (): OrderContextType => {
  return useContext(OrderContext) as OrderContextType;
};
