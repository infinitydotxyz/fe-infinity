import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { BigNumberish } from 'ethers';
import React, { ReactNode, useContext, useState } from 'react';
import { useAppContext } from './AppContext';
import { addBuy, addSell } from 'src/utils/marketUtils';
import { thirtyDaySeconds } from 'src/components/market/order-drawer/ui-constants';
import { formatEther, parseEther } from 'ethers/lib/utils';

export interface OrderCartItem {
  isSellOrder: boolean;
  imageUrl: string;
  tokenName?: string;
  tokenId?: string;
  collectionName: string;
  collectionAddress: string;
}

export interface OrderInCart {
  id: number;
  cartItems: OrderCartItem[];
  order: OBOrder;
}

const isCartItemEqual = (a: OrderCartItem, b: OrderCartItem): boolean => {
  return a.tokenName === b.tokenName && a.collectionName === b.collectionName;
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

  const [ordersInCart, setOrdersInCart] = useState<OrderInCart[]>([]);

  const [cartItems, setCartItems] = useState<OrderCartItem[]>([]);

  // drawer form
  const [price, setPrice] = useState<BigNumberish>(1);
  const [expirationDate, setExpirationDate] = useState<BigNumberish>(nowSeconds().add(thirtyDaySeconds));
  const [numItems, setNumItems] = useState<BigNumberish>(1);

  // for executing orders
  const { showAppError, showAppMessage, user, providerManager, chainId } = useAppContext();

  const isOrderBuilderEmpty = (): boolean => {
    return cartItems.length === 0;
  };

  const readyToCheckout = () => {
    return !isCartEmpty() && isOrderBuilderEmpty();
  };

  const getItems = (): Item[] => {
    const items: Item[] = [];

    for (const cartItem of cartItems) {
      items.push({
        tokenIds: [cartItem.tokenId ?? '????'],
        collection: cartItem.collectionAddress
      });
    }

    return items;
  };

  const getExecParams = (): ExecParams => {
    return { complicationAddress: '????', currencyAddress: '????' };
  };

  const getExtraParams = (): ExtraParams => {
    return { buyer: '????' };
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
    for (const orderInCart of ordersInCart) {
      if (orderInCart.id === id) {
        const index = indexOfOrderInCart(id);

        if (index != -1) {
          const orderInCart = ordersInCart[index];

          if (index !== -1) {
            const copy = [...ordersInCart];
            copy.splice(index, 1);

            setOrdersInCart(copy);
          }

          setCartItems(orderInCart.cartItems);
          setPrice(formatEther(orderInCart.order.startPrice));
          setExpirationDate(orderInCart.order.endTime);
          setNumItems(orderInCart.order.numItems);
        }
      }
    }
  };

  const addOrderToCart = () => {
    const order: OBOrder = {
      id: '????',
      chainId: chainId,
      isSellOrder: isSellOrderCart(),
      signerAddress: user?.address ?? '????',
      numItems,
      startTime: nowSeconds(),
      endTime: expirationDate,
      startPrice: parseEther(price.toString()),
      endPrice: parseEther(price.toString()),
      minBpsToSeller: 9000,
      nonce: 1,
      nfts: getItems(),
      execParams: getExecParams(),
      extraParams: getExtraParams()
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
    setExpirationDate(nowSeconds().add(thirtyDaySeconds));
    setNumItems(1);
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
