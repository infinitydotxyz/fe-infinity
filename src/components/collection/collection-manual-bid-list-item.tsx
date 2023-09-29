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
import useScreenSize from 'src/hooks/useScreenSize';

interface Props {
  order: ERC721TokenCartItem;
  collectionSlug: string;
  orderType: 'Collection Bid' | 'Token Bid' | 'Trait Bid';
}

export const CollectionManualBidListItem = ({ order, orderType, collectionSlug }: Props) => {
  const [startPriceEth] = useState(order.price);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isCollSelectable, isCollSelected, isNFTSelectable, isNFTSelected, toggleCollSelection, toggleNFTSelection } =
    useAppContext();
  const { isDesktop } = useScreenSize();

  const isTokenBid = orderType === 'Token Bid';
  const isCollBid = orderType === 'Collection Bid';
  let editableCartItem: ERC721CollectionCartItem | ERC721TokenCartItem = order;
  if (isCollBid) {
    editableCartItem = erc721TokenCartItemToCollectionCartItem(order);
  }

  const [addedToCart, setAddedToCart] = useState(
    isCollBid
      ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
      : isNFTSelected(editableCartItem as ERC721TokenCartItem)
  );

  const isActionable = orderType !== 'Trait Bid';

  useEffect(() => {
    setAddedToCart(
      isCollBid
        ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
        : isNFTSelected(editableCartItem as ERC721TokenCartItem)
    );
  }, [cartType, cartItems]);

  return (
    <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
      <div className="md:flex justify-between items-center w-full">
        <div className="md:w-1/3">
          <ManualOrderbookItem
            canShowAssetModal={isTokenBid}
            order={editableCartItem}
            isCollBid={isCollBid}
            collectionSlug={collectionSlug}
          />
        </div>

        <div className="md:w-1/6 md:flex-col flex justify-between md:mt-0 mt-2">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
          <div className="">{orderType}</div>
          {order.validUntil && isDesktop ? (
            <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>Expires {format(order.validUntil)}</div>
          ) : null}
        </div>

        <div className="md:w-1/6 md:flex-col flex justify-between md:mt-0 mt-2">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Price</div>
          <div className="">
            <EthPrice label={`${nFormatter(startPriceEth, 2)}`} />
          </div>
        </div>
        {order.validUntil && !isDesktop ? (
          <div className={twMerge(secondaryTextColor, 'text-xs font-medium my-2 text-right')}>
            Expires {format(order.validUntil)}
          </div>
        ) : null}

        <div className="md:w-1/4 flex justify-end">
          <Button
            disabled={!isActionable}
            className="mr-2"
            onClick={() => {
              if (!isConnected) {
                return;
              }
              editableCartItem.cartType = isCollBid ? CartType.CollectionBid : CartType.TokenBid;
              if (isCollBid && isCollSelectable(editableCartItem as ERC721CollectionCartItem)) {
                setCartType(CartType.CollectionBid);
                toggleCollSelection(editableCartItem as ERC721CollectionCartItem);
              } else if (!isCollBid && isNFTSelectable(editableCartItem as ERC721TokenCartItem)) {
                setCartType(CartType.TokenBid);
                toggleNFTSelection(editableCartItem as ERC721TokenCartItem);
              }
            }}
          >
            {addedToCart ? '✓' : ''} {'Bid higher'}
          </Button>
        </div>
      </div>
    </div>
  );
};
