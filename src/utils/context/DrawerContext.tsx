import { useRouter } from 'next/router';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  BuyNFTDrawerHandler,
  DrawerHandlerParams,
  useBuyDrawerHandler
} from 'src/components/market/order-drawer/buy-nft-drawer';

import { useOrderContext } from './OrderContext';

export type DrawerContextType = {
  cancelDrawerOpen: boolean;
  setCancelDrawerOpen: (flag: boolean) => void;

  sendDrawerOpen: boolean;
  setSendDrawerOpen: (flag: boolean) => void;

  cartItemCount: number;
  setCartItemCount: (n: number) => void;

  drawerParams: DrawerHandlerParams;

  drawerButtonClick: () => void;
  hasOrderDrawer: () => boolean;
  setAllowOrderDrawer: (flag: boolean) => void;
};

const DrawerContext = React.createContext<DrawerContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const DrawerContextProvider = ({ children }: Props) => {
  const [cancelDrawerOpen, setCancelDrawerOpen] = useState<boolean>(false);
  const [sendDrawerOpen, setSendDrawerOpen] = useState<boolean>(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const [allowOrderDrawer, setAllowOrderDrawer] = useState<boolean>(false);

  const router = useRouter();
  const { orderDrawerOpen, setOrderDrawerOpen, ordersInCart, cartItems } = useOrderContext();

  const hasOrderDrawer = () => {
    const path = router.asPath;

    const result =
      allowOrderDrawer ||
      (path.indexOf('me?tab=Orders') === -1 &&
        // path.indexOf('?tab=Orders') === -1 &&
        path.indexOf('me?tab=Send') === -1);

    return result;
  };

  const drawerButtonClick = () => {
    if (cartItems.length > 0 || ordersInCart.length > 0) {
      setOrderDrawerOpen(!orderDrawerOpen);
    } else if (drawerParams.orders.length > 0) {
      drawerParams.setShowDrawer(true);
    } else {
      // cancel drawer?
    }
  };

  // =========================================================

  const drawerParams: DrawerHandlerParams = useBuyDrawerHandler();

  useEffect(() => {
    let done = false;

    if (hasOrderDrawer()) {
      if (cartItems.length > 0 || ordersInCart.length > 0) {
        setCartItemCount(cartItems.length || ordersInCart.length);
        done = true;
      }
    }

    if (!done) {
      if (drawerParams.orders.length > 0) {
        setCartItemCount(drawerParams.orders.length);
      }
    }
  }, [ordersInCart, cartItems, router, drawerParams.orders]);

  // =========================================================

  const providerValue: DrawerContextType = {
    cancelDrawerOpen,
    setCancelDrawerOpen,

    sendDrawerOpen,
    setSendDrawerOpen,

    cartItemCount,
    setCartItemCount,

    hasOrderDrawer,
    setAllowOrderDrawer,

    drawerParams,
    drawerButtonClick
  };

  return (
    <DrawerContext.Provider value={providerValue}>
      <>
        {children}

        <BuyNFTDrawerHandler
          setShowDrawer={drawerParams.setShowDrawer}
          showDrawer={drawerParams.showDrawer}
          orders={drawerParams.orders}
          setOrders={drawerParams.setOrders}
          removeOrder={drawerParams.removeOrder}
        />
      </>
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = (): DrawerContextType => {
  return useContext(DrawerContext) as DrawerContextType;
};
