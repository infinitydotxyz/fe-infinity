import { useEffect, useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { erc721OrderCartItemToCollectionCartItem, erc721OrderCartItemToTokenCartItem, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721OrderCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { OrderExecutionStatusIcon, OrderMatchStatusIcon } from '../common/status-icon';
import { OrderbookItem } from '../orderbook/orderbook-item';
interface Props {
  order: ERC721OrderCartItem;
  orderType: 'Listing' | 'Token Bid' | 'Collection Bid';
}

export const CollectionOrderListItem = ({ order, orderType }: Props) => {
  const [startPriceEth] = useState(order.startPriceEth);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isNFTSelectable, isNFTSelected, toggleNFTSelection, isCollSelectable, isCollSelected, toggleCollSelection } =
    useAppContext();

  let editableCartItem: ERC721CollectionCartItem | ERC721TokenCartItem;
  const isCollBid = orderType === 'Collection Bid';
  if (isCollBid) {
    editableCartItem = erc721OrderCartItemToCollectionCartItem(order);
  } else {
    editableCartItem = erc721OrderCartItemToTokenCartItem(order);
  }

  const [addedToCart, setAddedToCart] = useState(
    isCollBid
      ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
      : isNFTSelected(editableCartItem as ERC721TokenCartItem)
  );

  const orderStatus = order.executionStatus?.status;
  const isActionable = !(orderStatus === 'matched-executed' || orderStatus === 'matched-executing');

  useEffect(() => {
    setAddedToCart(
      isCollBid
        ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
        : isNFTSelected(editableCartItem as ERC721TokenCartItem)
    );
  }, [cartType, cartItems]);

  return (
    <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
      <div className="flex justify-between items-center w-full">
        <div className="w-1/3">
          <OrderbookItem canShowAssetModal={true} nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
        </div>

        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
          <div className="">{orderType}</div>
          <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>Expires {format(order.endTimeMs)}</div>
        </div>
        <div className="w-1/4">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Match Status</div>
          <OrderMatchStatusIcon executionStatus={order.executionStatus} />
        </div>

        <div className="w-1/4">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Execution Status</div>
          <OrderExecutionStatusIcon executionStatus={order.executionStatus} isSellOrder={order.isSellOrder} />
        </div>

        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Price</div>
          <div className="">
            <EthPrice label={`${nFormatter(startPriceEth, 2)}`} />
          </div>
        </div>

        <div className="w-1/4 flex justify-end">
          <Button
            disabled={!isActionable}
            className="mr-2"
            onClick={() => {
              if (!isConnected) {
                return;
              }
              const newCartType = isCollBid ? CartType.CollectionBid : CartType.TokenBid;
              editableCartItem.cartType = newCartType;
              if (!isCollBid && isNFTSelectable(editableCartItem as ERC721TokenCartItem)) {
                setCartType(newCartType);
                toggleNFTSelection(editableCartItem as ERC721TokenCartItem);
              }
              if (isCollBid && isCollSelectable(editableCartItem as ERC721CollectionCartItem)) {
                setCartType(newCartType);
                toggleCollSelection(editableCartItem as ERC721CollectionCartItem);
              }
            }}
          >
            {addedToCart && (cartType === CartType.TokenBid || cartType === CartType.CollectionBid) ? '✓' : ''}{' '}
            {orderType === 'Listing' ? 'Buy now' : 'Bid higher'}
          </Button>
        </div>
      </div>
    </div>
  );
};
