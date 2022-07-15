import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, SVG, Spacer, toastSuccess, toastError, Divider } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { takeMultiplOneOrders } from 'src/utils/exchange/orders';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';

interface Props {
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onClickRemove: (order: SignedOBOrder) => void;
}

export const AcceptOfferDrawer = ({ open, onClose, orders, onClickRemove }: Props) => {
  const { providerManager, chainId, waitForTransaction } = useAppContext();

  const doAccept = async () => {
    try {
      const signer = providerManager?.getEthersProvider().getSigner();
      if (signer) {
        const chainOrders = orders.map((order) => order.signedOrder);
        const { hash } = await takeMultiplOneOrders(signer, chainId, chainOrders);
        toastSuccess('Transaction sent to chain');
        waitForTransaction(hash, () => {
          toastSuccess(`Transaction confirmed ${ellipsisAddress(hash)}`);
        });
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
        subtitle={'Accept these offers in one transaction'}
        title={<div className="flex items-center">Accept Offers</div>}
      >
        <div className="flex flex-col h-full">
          <ul className="overflow-y-auto content-between px-12">
            {orders.map((order: SignedOBOrder, idx) => {
              return (
                <li key={order.id + '_' + idx} className="py-3 flex">
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
            <Divider className="mb-10" />

            <Button size="large" onClick={doAccept}>
              Accept Offers
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};
