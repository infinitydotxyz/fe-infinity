import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { OrderDrawer } from 'src/components/orderbook';
import {
  FulfillOrderDrawerHandler,
  DrawerHandlerParams,
  useDrawerHandler
} from 'src/components/orderbook/order-drawer/fulfill-order-drawer';
import { CancelDrawer } from 'src/components/orderbook/order-drawer/cancel-drawer';
import { SendNFTsDrawer } from 'src/components/orderbook/order-drawer/send-nfts-drawer';

import { useOrderContext } from './OrderContext';

export type DrawerContextType = {
  cartItemCount: number;
  setCartItemCount: (n: number) => void;

  fulfillDrawerParams: DrawerHandlerParams;
  cancelDrawerParams: DrawerHandlerParams;
  transferDrawerParams: DrawerHandlerParams;

  drawerButtonClick: () => void;
};

const DrawerContext = React.createContext<DrawerContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const DrawerContextProvider = ({ children }: Props) => {
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  const router = useRouter();
  const { orderDrawerOpen, setOrderDrawerOpen, ordersInCart, cartItems } = useOrderContext();

  const drawerButtonClick = () => {
    if (cartItems.length > 0 || ordersInCart.length > 0) {
      setOrderDrawerOpen(!orderDrawerOpen);
    } else if (fulfillDrawerParams.orders.length > 0) {
      fulfillDrawerParams.setShowDrawer(true);
    } else if (cancelDrawerParams.orders.length > 0) {
      cancelDrawerParams.setShowDrawer(true);
    } else if (transferDrawerParams.nfts.length > 0) {
      transferDrawerParams.setShowDrawer(true);
    } else {
      // open order drawer if nothing else
      if (!orderDrawerOpen) {
        setOrderDrawerOpen(!orderDrawerOpen);
      }
    }
  };

  // =========================================================

  const fulfillDrawerParams: DrawerHandlerParams = useDrawerHandler();
  const cancelDrawerParams: DrawerHandlerParams = useDrawerHandler();
  const transferDrawerParams: DrawerHandlerParams = useDrawerHandler();

  useEffect(() => {
    let done = false;

    if (cartItems.length > 0 || ordersInCart.length > 0) {
      setCartItemCount(cartItems.length || ordersInCart.length);
      done = true;
    }

    if (!done) {
      if (fulfillDrawerParams.orders.length > 0) {
        setCartItemCount(fulfillDrawerParams.orders.length);
        done = true;
      }
    }

    if (!done) {
      if (cancelDrawerParams.orders.length > 0) {
        setCartItemCount(cancelDrawerParams.orders.length);
        done = true;
      }
    }

    if (!done) {
      if (transferDrawerParams.nfts.length > 0) {
        setCartItemCount(transferDrawerParams.nfts.length);
        done = true;
      }
    }

    // set to zero, all drawers are empty
    if (!done) {
      setCartItemCount(0);
      done = true;
    }
  }, [
    ordersInCart,
    cartItems,
    router,
    fulfillDrawerParams.orders,
    cancelDrawerParams.orders,
    transferDrawerParams.nfts
  ]);

  // =========================================================

  const providerValue: DrawerContextType = {
    cartItemCount,
    setCartItemCount,

    fulfillDrawerParams,
    cancelDrawerParams,
    transferDrawerParams,

    drawerButtonClick
  };

  return (
    <DrawerContext.Provider value={providerValue}>
      <>
        {children}

        {<OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />}

        <CancelDrawer
          orders={cancelDrawerParams.orders}
          open={cancelDrawerParams.showDrawer}
          onClose={() => {
            cancelDrawerParams.setShowDrawer(false);
          }}
          onClickRemove={(removingOrder) => {
            const arr = cancelDrawerParams.orders.filter((o) => o.id !== removingOrder.id);
            cancelDrawerParams.setOrders(arr);

            if (arr.length === 0) {
              cancelDrawerParams.setShowDrawer(false);
            }
          }}
        />

        <SendNFTsDrawer
          open={transferDrawerParams.showDrawer}
          onClose={() => {
            transferDrawerParams.setShowDrawer(false);
          }}
          nftsForTransfer={transferDrawerParams.nfts}
          onClickRemove={(removingItem) => {
            const arr = transferDrawerParams.nfts.filter((o: ERC721CardData) => o.id !== removingItem.id);
            transferDrawerParams.setNfts(arr);
            if (arr.length === 0) {
              transferDrawerParams.setShowDrawer(false);
            }
          }}
          onSubmit={(hash) => {
            console.log(hash);
            // TODO - steve
            // setSendTxHash(hash);
            // {sendTxHash && <WaitingForTxModal title={'Sending NFTs'} txHash={sendTxHash} onClose={() => setSendTxHash('')} />}
          }}
        />

        <FulfillOrderDrawerHandler
          setShowDrawer={fulfillDrawerParams.setShowDrawer}
          showDrawer={fulfillDrawerParams.showDrawer}
          orders={fulfillDrawerParams.orders}
          setOrders={fulfillDrawerParams.setOrders}
          removeOrder={fulfillDrawerParams.removeOrder}
        />
      </>
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = (): DrawerContextType => {
  return useContext(DrawerContext) as DrawerContextType;
};
