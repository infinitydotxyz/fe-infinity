import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { format } from 'timeago.js';
import { ALowerPriceModal } from '../astra/modals/astra-lower-price-modal';
import { OrderbookItem } from '../orderbook/list/orderbook-item';
import { OrderDetailModal } from '../orderbook/OrderDetailModal';

interface Props {
  order: SignedOBOrder;
  selected?: boolean;
  orderType: UserOrderFilter['orderType'];
  userInfo: UserProfileDto;
  onClickActionBtn: (order: SignedOBOrder) => void;
}

type UserOrderFilter = {
  orderType?: 'listings' | 'offers-made' | 'offers-received' | '';
  minPrice?: string;
  maxPrice?: string;
  numItems?: string;
  collections?: string[];
};

export const UserOrderListItem = ({ order, orderType, onClickActionBtn, selected }: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<SignedOBOrder | null>(null);
  const [showLowerPriceModal, setShowLowerPriceModal] = useState(false);
  const [startPriceEth, setStartPriceEth] = useState(order.startPriceEth);
  const { checkSignedIn } = useOnboardContext();

  const onClickLowerPrice = () => {
    if (!checkSignedIn()) {
      return;
    }
    setShowLowerPriceModal(true);
  };

  return (
    <div>
      {showLowerPriceModal && (
        <ALowerPriceModal
          isOpen={showLowerPriceModal}
          onClose={() => setShowLowerPriceModal(false)}
          order={order}
          onDone={(val) => setStartPriceEth(val)}
        />
      )}
      <div className="bg-gray-100 px-10 py-6 rounded-3xl flex font-heading">
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
            <div className={secondaryTextColor}>Order type</div>
            <div className="font-bold">
              {orderType === 'listings' ? 'Listing' : orderType === 'offers-made' ? 'Offer made' : 'Offer received'}
            </div>
          </div>
          <div className="w-1/8">
            <div className={secondaryTextColor}>Price</div>
            <div className="font-bold">
              <EthPrice label={`${startPriceEth}`} />
            </div>
          </div>
          <div className="w-1/8">
            <div className={secondaryTextColor}># NFTs</div>
            <div className="font-bold">{order.numItems}</div>
          </div>
          <div className="w-1/8">
            <div className={secondaryTextColor}>Expiry</div>
            <div className="font-bold">{format(order.endTimeMs)}</div>
          </div>
          {orderType === 'listings' || orderType === 'offers-made' ? (
            <Button
              onClick={() => {
                onClickLowerPrice();
              }}
            >
              Lower Price
            </Button>
          ) : null}
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
