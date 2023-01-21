import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { ERC721OrderCartItem, TokensFilter } from 'src/utils/types';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { ALowerPriceModal } from '../astra/modals/astra-lower-price-modal';
import { OrderbookItem } from '../orderbook/list/orderbook-item';
import { OrderDetailModal } from '../orderbook/order-detail-modal';

interface Props {
  order: ERC721OrderCartItem;
  selected?: boolean;
  orderType: TokensFilter['orderType'];
  onClickActionBtn: (order: ERC721OrderCartItem) => void;
}

export const ProfileOrderListItem = ({ order, orderType, onClickActionBtn, selected }: Props) => {
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
      <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
        <div className="flex justify-between items-center w-full">
          <div className="w-1/4">
            <OrderbookItem
              canShowAssetModal={true}
              nameItem={true}
              key={`${order.id} ${order.chainId}`}
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          </div>

          <div className="w-1/6">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
            <div className="">
              {orderType === 'listings' ? 'Listing' : orderType === 'offers-made' ? 'Offer made' : 'Offer received'}
            </div>
          </div>
          <div className="w-1/6">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Price</div>
            <div className="">
              <EthPrice label={`${startPriceEth}`} />
            </div>
          </div>
          <div className="w-1/6">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Expiry</div>
            <div className="">{format(order.endTimeMs)}</div>
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
