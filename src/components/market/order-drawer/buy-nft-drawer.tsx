import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, Spacer, toastSuccess, toastError, Divider, toastInfo, SVG } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { canTakeMultipleOneOrders, takeMultipleOneOrders } from 'src/utils/exchange/orders';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';
import { WaitingForTxModal } from '../order-drawer/waiting-for-tx-modal';
import { useEffect, useState } from 'react';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

interface Props {
  title: string;
  submitTitle: string;
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onSubmitDone: (hash: string) => void;
  onClickRemove: (order: SignedOBOrder) => void;
}

const BuyNFTDrawer = ({ open, onClose, orders, onClickRemove, onSubmitDone, title, submitTitle }: Props) => {
  const { providerManager, chainId, waitForTransaction } = useAppContext();

  const onClickBuy = async () => {
    try {
      const signer = providerManager?.getEthersProvider().getSigner();
      if (signer) {
        const chainOrders = orders.map((order) => order.signedOrder);
        const canTakeOrders = await canTakeMultipleOneOrders(signer, chainId, chainOrders);
        if (canTakeOrders === 'yes') {
          const { hash } = await takeMultipleOneOrders(signer, chainId, chainOrders);
          toastSuccess('Sent txn to chain for execution');
          waitForTransaction(hash, () => {
            toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
          });
          onSubmitDone(hash);
        } else if (canTakeOrders === 'staleOwner') {
          toastError('One or more of these orders have NFTs with stale owner');
        } else if (canTakeOrders === 'cannotExecute') {
          toastError('One or more of these orders are invalid/expired');
        } else if (canTakeOrders === 'notOwner') {
          toastError('One or more of these orders are not owned by you');
        } else {
          toastError('One or more of these orders cannot be fulfilled');
        }
      } else {
        throw 'Signer is null';
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        subtitle={'Batch buy/sell these NFTs in one transaction'}
        title={<div className="flex items-center">{title}</div>}
      >
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto content-between px-12">
            {orders.map((order: SignedOBOrder, idx) => {
              return (
                <div key={order.id + '_' + idx} className="py-3 flex">
                  <div className="w-full flex justify-between">
                    <div className="flex-1">
                      <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
                    </div>
                  </div>

                  <button onClick={() => onClickRemove(order)}>
                    <SVG.grayDelete className={iconButtonStyle} />
                  </button>
                </div>
              );
            })}
          </div>
          <Spacer />

          <footer className="w-full text-center py-4">
            <Divider className="mb-10" />

            <Button size="large" onClick={onClickBuy}>
              {submitTitle}
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};

// ===============================================================

export interface DrawerHandlerParams {
  orders: SignedOBOrder[];
  setOrders: (orders: SignedOBOrder[]) => void;
  removeOrder: (order: SignedOBOrder) => void;
  addOrder: (order: SignedOBOrder) => void;
  showDrawer: boolean;
  setShowDrawer: (flag: boolean) => void;
}

export const useBuyDrawerHandler = (): DrawerHandlerParams => {
  const [orders, setOrders] = useState<SignedOBOrder[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const { setOrderDrawerOpen } = useOrderContext();

  const removeOrder = (order: SignedOBOrder) => {
    const arr = orders.filter((o) => o.id !== order.id);
    setOrders(arr);

    if (arr.length === 0) {
      setShowDrawer(false);
      setOrderDrawerOpen(false);
    }
  };

  const addOrder = (order: SignedOBOrder) => {
    const exists = orders.findIndex((o) => o.id === order.id) !== -1;
    if (!exists) {
      const arr = [...orders, order];

      setOrders(arr);
    }

    setShowDrawer(true);
  };

  return { orders, setOrders, removeOrder, addOrder, showDrawer, setShowDrawer };
};

// ===================================================

interface Props2 {
  setShowDrawer: (flag: boolean) => void;
  showDrawer: boolean;
  orders: SignedOBOrder[];
  setOrders: (orders: SignedOBOrder[]) => void;
  removeOrder: (order: SignedOBOrder) => void;
}

export const BuyNFTDrawerHandler = ({ removeOrder, showDrawer, orders, setShowDrawer }: Props2) => {
  const [completeOrderTxHash, setCompleteOrderTxHash] = useState('');
  const { setOrderDrawerOpen, orderDrawerOpen } = useOrderContext();
  const { hasOrderDrawer } = useDrawerContext();

  useEffect(() => {
    if (orderDrawerOpen && !hasOrderDrawer()) {
      setShowDrawer(true);
    }
  }, [orderDrawerOpen]);

  const first = orders.length > 0 ? orders[0] : undefined;

  return (
    <div>
      <BuyNFTDrawer
        onClickRemove={removeOrder}
        title={first?.isSellOrder ? 'Buy Order' : 'Sell Order'}
        submitTitle={first?.isSellOrder ? 'Buy' : 'Sell'}
        orders={orders}
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setOrderDrawerOpen(false);
        }}
        onSubmitDone={(hash: string) => {
          setShowDrawer(false);
          setOrderDrawerOpen(false);
          setCompleteOrderTxHash(hash);
        }}
      />

      {completeOrderTxHash && (
        <WaitingForTxModal
          title={'Complete Order'}
          txHash={completeOrderTxHash}
          onClose={() => setCompleteOrderTxHash('')}
        />
      )}
    </div>
  );
};
