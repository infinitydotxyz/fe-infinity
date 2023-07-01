import { useEffect, useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { erc721TokenCartItemToCollectionCartItem, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { ManualOrderbookItem } from '../orderbook/manual-orderbook-item';

interface Props {
  order: ERC721TokenCartItem;
  orderType: 'Collection Bid';
}

export const CollectionManualBidListItem = ({ order, orderType }: Props) => {
  const [startPriceEth] = useState(order.price);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isCollSelectable, isCollSelected, toggleCollSelection } = useAppContext();

  const editableCartItem: ERC721CollectionCartItem = erc721TokenCartItemToCollectionCartItem(order);

  const [addedToCart, setAddedToCart] = useState(isCollSelected(editableCartItem as ERC721CollectionCartItem));

  const isActionable = true;

  useEffect(() => {
    setAddedToCart(isCollSelected(editableCartItem as ERC721CollectionCartItem));
  }, [cartType, cartItems]);

  return (
    <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
      <div className="flex justify-between items-center w-full">
        <div className="w-1/3">
          <ManualOrderbookItem
            canShowAssetModal={true}
            nameItem={true}
            key={`${order.id} ${order.chainId}`}
            order={order}
          />
        </div>

        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
          <div className="">{orderType}</div>
          <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>
            Expires {format(order.validUntil ?? 0)}
          </div>
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
              editableCartItem.cartType = CartType.CollectionBid;
              if (isCollSelectable(editableCartItem as ERC721CollectionCartItem)) {
                setCartType(CartType.CollectionBid);
                toggleCollSelection(editableCartItem as ERC721CollectionCartItem);
              }
            }}
          >
            {addedToCart && cartType === CartType.CollectionBid ? '✓' : ''} {'Bid higher'}
          </Button>
        </div>
      </div>
    </div>
  );
};
