import { ERC721CardData, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, Spacer, toastSuccess, toastError, Divider, toastInfo, SVG } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { canTakeMultipleOneOrders, takeMultipleOneOrders } from 'src/utils/exchange/orders';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';
import { WaitingForTxModal } from './waiting-for-tx-modal';
import { useEffect, useState } from 'react';
import { OrderDetailPicker } from '../order-detail-picker';

interface Props {
  title: string;
  submitTitle: string;
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onSubmitDone: (hash: string) => void;
  onClickRemove: (order: SignedOBOrder) => void;
}

interface ReadyOrder {
  order: SignedOBOrder;
  selection: Set<string>;
  valid: boolean;
}

const FulfillOrderDrawer = ({ open, onClose, orders, onClickRemove, onSubmitDone, title, submitTitle }: Props) => {
  const { providerManager, chainId, waitForTransaction } = useAppContext();
  const [readyOrders, setReadyOrders] = useState<ReadyOrder[]>([]);

  useEffect(() => {
    const rOrders = orders.map((e) => {
      return {
        order: e,
        selection: new Set<string>(),
        valid: false
      };
    });

    updateValidFlags(rOrders);
  }, [orders]);

  const updateValidFlags = (rOrders: ReadyOrder[]) => {
    for (const rOrder of rOrders) {
      rOrder.valid = orderIsValid(rOrder);
    }

    setReadyOrders(rOrders);
  };

  const orderIsValid = (rOrder: ReadyOrder) => {
    let numTokensToChoose = 0;

    for (const nft of rOrder.order.nfts) {
      numTokensToChoose += nft.tokens.length;
    }

    if (numTokensToChoose > rOrder.order.numItems) {
      return rOrder.selection.size === rOrder.order.numItems;
    }

    return true;
  };

  const allOrdersValid = () => {
    for (const rOrder of readyOrders) {
      if (!rOrder.valid) {
        return false;
      }
    }

    return true;
  };

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

  const content = () => {
    return readyOrders.map((rOrder, idx) => {
      if (!rOrder.valid) {
        return (
          <div className="bg-theme-light-200 rounded-2xl p-4">
            <OrderDetailPicker
              order={rOrder.order}
              selection={rOrder.selection}
              onChange={(newSelection) => {
                rOrder.selection = newSelection;

                setReadyOrders([...readyOrders]);
              }}
            />

            <div className="flex w-full justify-end space-x-4 mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  onClickRemove(rOrder.order);
                }}
              >
                Remove
              </Button>
              <Button
                onClick={() => {
                  updateValidFlags([...readyOrders]);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <div key={rOrder.order.id + '_' + idx} className="py-3 flex">
            <div className="w-full flex justify-between">
              <div className="flex-1">
                <OrderbookItem
                  nameItem={true}
                  key={`${rOrder.order.id} ${rOrder.order.chainId}`}
                  order={rOrder.order}
                />
              </div>
            </div>

            <button onClick={() => onClickRemove(rOrder.order)}>
              <SVG.grayDelete className={iconButtonStyle} />
            </button>
          </div>
        );
      }
    });
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
          <div className="overflow-y-auto content-between px-12">{content()}</div>
          <Spacer />

          <footer className="w-full text-center py-4">
            <Divider className="mb-10" />

            <Button size="large" onClick={onClickBuy} disabled={!allOrdersValid()}>
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

  // for transfer drawer
  nfts: ERC721CardData[];
  setNfts: (orders: ERC721CardData[]) => void;
  removeNft: (order: ERC721CardData) => void;
  addNft: (order: ERC721CardData) => void;
}

export const useDrawerHandler = (): DrawerHandlerParams => {
  const [orders, setOrders] = useState<SignedOBOrder[]>([]);
  const [nfts, setNfts] = useState<ERC721CardData[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);

  const removeOrder = (order: SignedOBOrder) => {
    const arr = orders.filter((o) => o.id !== order.id);
    setOrders(arr);

    if (arr.length === 0) {
      setShowDrawer(false);
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

  const removeNft = (nft: ERC721CardData) => {
    const arr = nfts.filter((o) => o.id !== nft.id);
    setNfts(arr);

    if (arr.length === 0) {
      setShowDrawer(false);
    }
  };

  const addNft = (nft: ERC721CardData) => {
    const exists = nfts.findIndex((o) => o.id === nft.id) !== -1;
    if (!exists) {
      const arr = [...nfts, nft];

      setNfts(arr);
    }

    setShowDrawer(true);
  };

  return { orders, setOrders, removeOrder, addOrder, showDrawer, setShowDrawer, nfts, setNfts, removeNft, addNft };
};

// ===================================================

interface Props2 {
  setShowDrawer: (flag: boolean) => void;
  showDrawer: boolean;
  orders: SignedOBOrder[];
  setOrders: (orders: SignedOBOrder[]) => void;
  removeOrder: (order: SignedOBOrder) => void;
}

export const FulfillOrderDrawerHandler = ({ removeOrder, showDrawer, orders, setShowDrawer }: Props2) => {
  const [completeOrderTxHash, setCompleteOrderTxHash] = useState('');

  const first = orders.length > 0 ? orders[0] : undefined;

  return (
    <div>
      <FulfillOrderDrawer
        onClickRemove={removeOrder}
        title={first?.isSellOrder ? 'Buy Order' : 'Sell Order'}
        submitTitle={first?.isSellOrder ? 'Buy' : 'Sell'}
        orders={orders}
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
        onSubmitDone={(hash: string) => {
          setShowDrawer(false);
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
