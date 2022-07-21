import { ERC721CardData, OBOrderItem, OBTokenInfo, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, Spacer, toastSuccess, toastError, Divider, toastInfo, SVG } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { canTakeMultipleOneOrders, takeMultipleOneOrders } from 'src/utils/exchange/orders';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';
import { WaitingForTxModal } from './waiting-for-tx-modal';
import { useEffect, useState } from 'react';
import { orderDetailKey, OrderDetailPicker } from '../order-detail-picker';

interface Props {
  title: string;
  submitTitle: string;
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onSubmitDone: (hash: string) => void;
  onClickRemove: (order: SignedOBOrder) => void;
}

const FulfillOrderDrawer = ({ open, onClose, orders, onClickRemove, onSubmitDone, title, submitTitle }: Props) => {
  const { providerManager, chainId, waitForTransaction } = useAppContext();
  const [readyOrders, setReadyOrders] = useState<ReadyOrders>(new ReadyOrders([]));

  useEffect(() => {
    const rOrders = orders.map((e) => {
      return new ReadyOrder(e, new Set<string>(), false);
    });

    updateValidFlags(rOrders);
  }, [orders]);

  const updateValidFlags = (rOrders: ReadyOrder[]) => {
    for (const rOrder of rOrders) {
      rOrder.updateIsValid();
    }

    setReadyOrders(new ReadyOrders(rOrders));
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
    return readyOrders.orders.map((rOrder, idx) => {
      if (!rOrder.valid) {
        return (
          <div className="bg-theme-light-200 rounded-2xl p-4">
            <OrderDetailPicker
              order={rOrder.order}
              selection={rOrder.selection}
              onChange={(newSelection) => {
                rOrder.selection = newSelection;

                setReadyOrders(new ReadyOrders(readyOrders.orders));
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
                  updateValidFlags(readyOrders.orders);
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
                  order={rOrder.modifiedOrder()}
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

            <Button size="large" onClick={onClickBuy} disabled={!readyOrders.allOrdersValid()}>
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

// ===============================================

class ReadyOrders {
  constructor(orders: ReadyOrder[]) {
    this.orders = orders;
  }
  orders: ReadyOrder[];

  allOrdersValid() {
    for (const rOrder of this.orders) {
      if (!rOrder.valid) {
        return false;
      }
    }

    return true;
  }
}

class ReadyOrder {
  constructor(order: SignedOBOrder, selection: Set<string>, valid: boolean) {
    this.order = order;
    this.selection = selection;
    this.valid = valid;
  }
  order: SignedOBOrder;
  selection: Set<string>;
  valid: boolean;

  modifiedOrder(): SignedOBOrder {
    if (this.selection.size > 0) {
      const newOrder = JSON.parse(JSON.stringify(this.order)) as SignedOBOrder;
      const newNfts: OBOrderItem[] = [];

      // only add the tokens we selected so it will draw correctly
      for (const nft of newOrder.nfts) {
        const newTokens: OBTokenInfo[] = [];

        for (const token of nft.tokens) {
          const key = orderDetailKey(nft.collectionAddress, token.tokenId);

          if (this.selection.has(key)) {
            newTokens.push(token);
          }
        }

        nft.tokens = newTokens;

        if (nft.tokens.length > 0) {
          newNfts.push(nft);
        }
      }

      newOrder.nfts = newNfts;

      return newOrder;
    }

    return this.order;
  }

  updateIsValid() {
    let numTokensToChoose = 0;

    for (const nft of this.order.nfts) {
      numTokensToChoose += nft.tokens.length;
    }

    if (numTokensToChoose > this.order.numItems) {
      this.valid = this.selection.size === this.order.numItems;
    } else {
      this.valid = true;
    }
  }
}
