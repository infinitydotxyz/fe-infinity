import { useEffect, useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { erc721OrderCartItemToTokenCartItem } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721OrderCartItem, TokensFilter } from 'src/utils/types';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { OrderExecutionStatusIcon, OrderMatchStatusIcon } from '../common/status-icon';
import { OrderbookItem } from '../orderbook/orderbook-item';
interface Props {
  order: ERC721OrderCartItem;
  orderType: TokensFilter['orderType'];
}

export const ProfileOrderListItem = ({ order, orderType }: Props) => {
  const [startPriceEth] = useState(order.startPriceEth);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isNFTSelectable, isNFTSelected, toggleNFTSelection, isOrderSelected, toggleOrderSelection } = useAppContext();

  const editCartToken = erc721OrderCartItemToTokenCartItem(order);

  const [addedToEditCart, setAddedToEditCart] = useState(isNFTSelected(editCartToken));
  const [addedToCancelCart, setAddedToCancelCart] = useState(isOrderSelected(order));

  const orderStatus = order.executionStatus?.status;
  const isActionable = !(
    orderStatus === 'matched-executed' ||
    orderStatus === 'matched-executing' ||
    orderStatus === 'matched-pending-execution'
  );

  useEffect(() => {
    setAddedToEditCart(isNFTSelected(editCartToken));
    setAddedToCancelCart(isOrderSelected(order));
  }, [cartType, cartItems]);

  return (
    <div>
      <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
        <div className="flex justify-between items-center w-full">
          <div className="w-1/4">
            <OrderbookItem
              canShowAssetModal={true}
              nameItem={true}
              key={`${order.id} ${order.chainId}`}
              order={order}
            />
          </div>

          <div className="w-1/6">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
            <div className="">
              {orderType === 'listings' ? 'Listing' : orderType === 'offers-made' ? 'Bid' : 'Offer'}
            </div>
            <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>Expires {format(order.endTimeMs)}</div>
          </div>
          <div className="w-1/4">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Match Status</div>
            <OrderMatchStatusIcon executionStatus={order.executionStatus} />
          </div>

          <div className="w-1/4">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Execution Status</div>
            <OrderExecutionStatusIcon executionStatus={order.executionStatus} />
          </div>

          <div className="w-1/6">
            <div className={twMerge(secondaryTextColor, 'font-medium')}>Price</div>
            <div className="">
              <EthPrice label={`${startPriceEth}`} />
            </div>
          </div>

          {orderType === 'listings' || orderType === 'offers-made' ? (
            <div className="w-1/4 flex justify-end">
              <Button
                disabled={!isActionable}
                className="mr-2"
                onClick={() => {
                  if (!isConnected) {
                    return;
                  }
                  const newCartType = orderType === 'listings' ? CartType.TokenList : CartType.TokenOffer;
                  editCartToken.cartType = newCartType;
                  if (isNFTSelectable(editCartToken)) {
                    setCartType(newCartType);
                    toggleNFTSelection(editCartToken);
                  }
                }}
              >
                {addedToEditCart && (cartType === CartType.TokenList || cartType === CartType.TokenOffer) ? '✓' : ''}{' '}
                Edit in Cart
              </Button>

              <Button
                disabled={!isActionable}
                onClick={() => {
                  if (!isConnected) {
                    return;
                  }
                  const newCartType = CartType.Cancel;
                  order.cartType = newCartType;
                  setCartType(newCartType);
                  toggleOrderSelection(order);
                }}
              >
                {addedToCancelCart && cartType === CartType.Cancel ? '✓' : ''} Cancel
              </Button>
            </div>
          ) : null}

          {orderType === 'offers-received' ? (
            <div className="w-1/6 flex justify-end">
              <Button
                disabled={!isActionable}
                onClick={() => {
                  if (!isConnected) {
                    return;
                  }
                  const newCartType = CartType.TokenList;
                  editCartToken.cartType = newCartType;
                  if (isNFTSelectable(editCartToken)) {
                    setCartType(newCartType);
                    toggleNFTSelection(editCartToken);
                  }
                }}
              >
                {addedToEditCart && cartType === CartType.TokenList ? '✓' : ''} Sell Now
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
