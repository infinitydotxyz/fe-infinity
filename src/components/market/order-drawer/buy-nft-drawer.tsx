import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, Spacer, toastSuccess, toastError, Divider, toastInfo } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { canTakeMultipleOneOrders, takeMultipleOneOrders } from 'src/utils/exchange/orders';
import { Drawer } from '../../common/drawer';
import { OrderbookItem } from '../orderbook-list/orderbook-item';

interface Props {
  title: string;
  submitTitle: string;
  open: boolean;
  onClose: () => void;
  orders: SignedOBOrder[];
  onSubmitDone: (hash: string) => void;
}

export const BuyNFTDrawer = ({ open, onClose, orders, onSubmitDone, title, submitTitle }: Props) => {
  const { providerManager, chainId, waitForTransaction } = useAppContext();

  const onClickBuy = async () => {
    try {
      const signer = providerManager?.getEthersProvider().getSigner();
      if (signer) {
        const chainOrders = orders.map((order) => order.signedOrder);
        const canTakeOrders = await canTakeMultipleOneOrders(signer, chainId, chainOrders);
        if (canTakeOrders === 'yes') {
          const { hash } = await takeMultipleOneOrders(signer, chainId, [orders[0].signedOrder]);
          toastSuccess('Sent txn to chain for execution');
          waitForTransaction(hash, () => {
            toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
          });
          onSubmitDone(hash);
        } else if (canTakeOrders === 'staleOwner') {
          toastError('One or more of these orders have NFTs with stale owner');
        } else if (canTakeOrders === 'cannotExecute') {
          toastError('One or more of these orders are invalid/expired');
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
      <Drawer open={open} onClose={onClose} subtitle={''} title={<div className="flex items-center">{title}</div>}>
        <div className="flex flex-col h-full">
          <ul className="overflow-y-auto content-between px-12">
            {orders.map((order: SignedOBOrder, idx) => {
              return (
                <li key={order.id + '_' + idx} className="py-3 flex">
                  <div className="w-full flex justify-between">
                    <div className="flex-1">
                      <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
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
