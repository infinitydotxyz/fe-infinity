import { useEffect, useState } from 'react';
import { EthPrice } from 'src/components/common';
import { erc721TokenCartItemToCollectionCartItem, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { ManualOrderbookItem } from '../orderbook/manual-orderbook-item';
import { AButton } from '../astra/astra-button';

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
    <div className={twMerge('flex text-sm mx-4 bg-zinc-300 dark:bg-neutral-800 rounded-lg p-4')}>
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
          <div className={twMerge(secondaryTextColor, 'font-medium text-gray-800')}>Order type</div>
          <div className="font-semibold text-neutral-700 dark:text-white">{orderType}</div>
        </div>

        <div className="md:w-1/6 md:flex-col flex justify-between md:mt-0 mt-2">
          <div className={twMerge(secondaryTextColor, 'font-medium text-gray-800')}>Price</div>
          <div>
            <EthPrice className="text-amber-700 font-supply text-17" label={`${nFormatter(startPriceEth, 2)}`} />
          </div>
        </div>

        <div className="md:w-1/4 flex justify-end items-center gap-4">
          {order.validUntil ? (
            <div
              className={twMerge(
                'hidden md:inline-flex bg-[#E6E6DC] dark:bg-zinc-700 rounded-5 text-sm font-medium px-7'
              )}
            >
              Expires {format(order.validUntil)}
            </div>
          ) : null}
          <AButton
            primary
            className="px-5 py-2.5 rounded-6 md:w-auto w-full md:mt-0 mt-2 flex justify-center leading-3.5 dark:border-transparent font-semibold"
            disabled={!isActionable}
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
            {order.validUntil ? (
              <div
                className={twMerge(
                  secondaryTextColor,
                  'md:hidden text-xs font-medium text-right text-gray-300 dark:text-neutral-700'
                )}
              >
                Expires {format(order.validUntil)}
              </div>
            ) : null}
          </AButton>
        </div>
      </div>
    </div>
  );
};
