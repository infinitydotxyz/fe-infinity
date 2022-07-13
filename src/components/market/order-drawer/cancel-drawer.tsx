import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, SVG, Spacer, toastSuccess } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { cancelMultipleOrders } from 'src/utils/exchange/orders';
import { iconButtonStyle } from 'src/utils/ui-constants';
// import { format } from 'timeago.js';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';

interface Props {
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onClickRemove: (order: SignedOBOrder) => void;
}

export const CancelDrawer = ({ open, onClose, orders, onClickRemove }: Props) => {
  const { providerManager, chainId } = useAppContext();

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        subtitle={'Cancel these orders in one transaction :)'}
        title={<div className="flex items-center">Cancel Orders</div>}
      >
        <div className="flex flex-col h-full">
          <ul className="overflow-y-auto content-between px-12">
            {orders.map((order: SignedOBOrder, idx) => {
              return (
                <li key={order.id + '_' + idx} className="py-3 flex">
                  {/* <div>
                    <NftImage
                      className="w-20 h-20 rounded-3xl"
                      chainId={order.chainId}
                      collectionAddress={order.nfts[0]?.collectionAddress}
                    />
                  </div>
                  <div className="pl-4">
                    <div>Min price: {order.endPriceEth}</div>
                    <div># NFTs: {order.numItems}</div>
                    <div>Expiry date: {format(order.endTimeMs)}</div>
                  </div> */}
                  <div className="w-full flex justify-between">
                    <div className="flex-1">
                      <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
                    </div>
                    <button onClick={() => onClickRemove(order)}>
                      <SVG.grayDelete className={iconButtonStyle} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Spacer />

          <footer className="w-full text-center py-4">
            <Button
              size="large"
              onClick={async () => {
                const signer = providerManager?.getEthersProvider().getSigner();
                if (signer) {
                  const nonces = orders.map((order) => order.nonce);
                  await cancelMultipleOrders(signer, chainId, nonces);
                  toastSuccess('Transaction sent to chain');
                } else {
                  throw 'Signer is null';
                }
              }}
            >
              Cancel Listings
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};
