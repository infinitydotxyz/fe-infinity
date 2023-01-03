import { useState } from 'react';
import { EthPrice, Button } from 'src/components/common';
import { format } from 'timeago.js';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { OrderbookItem } from '../orderbook/orderbook-list/orderbook-item';
import { UserOrderFilter } from '../filter/user-profile-order-filter-panel';
import { OrderDetailModal } from '../orderbook/OrderDetailModal';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';

interface Props {
  order: SignedOBOrder;
  selected?: boolean;
  orderType: UserOrderFilter['orderType'];
  userInfo: UserProfileDto;
  onClickActionBtn: (order: SignedOBOrder) => void;
}

export const UserPageOrderListItem = ({ order, orderType, onClickActionBtn, selected }: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<SignedOBOrder | null>(null);

  return (
    <div>
      <div className="bg-theme-light-200 px-10 py-6 rounded-3xl flex font-heading">
        <div className="flex justify-between items-center w-full">
          <div className="w-1/4">
            <OrderbookItem
              nameItem={true}
              key={`${order.id} ${order.chainId}`}
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          </div>

          <div className="w-1/8">
            <div className="text-gray-400">Order type</div>
            <div className="font-bold">
              {orderType === 'listings' ? 'Listing' : orderType === 'offers-made' ? 'Offer made' : 'Offer received'}
            </div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400">Price</div>
            <div className="font-bold">
              <EthPrice label={`${order.startPriceEth}`} />
            </div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400"># NFTs</div>
            <div className="font-bold">{order.numItems}</div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400">Expiry</div>
            <div className="font-bold">{format(order.endTimeMs)}</div>
          </div>
          {orderType === 'listings' || orderType === 'offers-made' ? (
            <Button
              onClick={() => {
                onClickActionBtn(order);
              }}
            >
              {selected ? '✓' : ''} Cancel
            </Button>
          ) : null}
        </div>
      </div>

      {selectedOrder !== null ? (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={true}
          onClose={() => {
            setSelectedOrder(null);
          }}
        />
      ) : null}
    </div>
  );
};
