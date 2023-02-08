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
import { OrderbookItem } from '../orderbook/list/orderbook-item';

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
              {addedToEditCart && (cartType === CartType.TokenList || cartType === CartType.TokenOffer) ? '✓' : ''} Edit
              in Cart
            </Button>
          ) : null}

          {orderType === 'listings' || orderType === 'offers-made' ? (
            <Button
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
          ) : null}

          {orderType === 'offers-received' ? (
            <Button
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
          ) : null}
        </div>
      </div>
    </div>
  );
};
