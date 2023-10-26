import { useEffect, useState } from 'react';
import { Button, EthPrice } from 'src/components/common';
import { erc721TokenCartItemToCollectionCartItem, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem, TokensFilter } from 'src/utils/types';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { useAccount } from 'wagmi';
import { ManualOrderbookItem } from '../orderbook/manual-orderbook-item';
import { AButton } from '../astra/astra-button';
import { EditIcon } from 'src/icons';
import { DeleteIcon } from 'src/icons/DeleteIcon';

interface Props {
  isOwner: boolean;
  order: ERC721TokenCartItem;
  orderType: TokensFilter['orderType'];
}

export const ProfileManualOrderListItem = ({ order, orderType, isOwner }: Props) => {
  const [startPriceEth] = useState(order.price);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isNFTSelectable, isNFTSelected, toggleNFTSelection, isCollSelectable, isCollSelected, toggleCollSelection } =
    useAppContext();

  const isTokenBid = orderType === 'bids-placed' && order.criteria?.kind === 'token';

  let editableCartItem: ERC721CollectionCartItem | ERC721TokenCartItem;
  const isCollBid = orderType === 'bids-placed' && order.criteria?.kind === 'collection';
  if (isCollBid) {
    editableCartItem = erc721TokenCartItemToCollectionCartItem(order);
  } else {
    editableCartItem = order;
  }

  const [addedToEditCart, setAddedToEditCart] = useState(
    isCollBid
      ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
      : isNFTSelected(editableCartItem as ERC721TokenCartItem)
  );
  const [addedToCancelCart, setAddedToCancelCart] = useState(
    isCollBid
      ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
      : isNFTSelected(editableCartItem as ERC721TokenCartItem)
  );

  const isActionable = isOwner;

  useEffect(() => {
    setAddedToEditCart(
      isCollBid
        ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
        : isNFTSelected(editableCartItem as ERC721TokenCartItem)
    );
    setAddedToCancelCart(
      isCollBid
        ? isCollSelected(editableCartItem as ERC721CollectionCartItem)
        : isNFTSelected(editableCartItem as ERC721TokenCartItem)
    );
  }, [cartType, cartItems]);

  return (
    <div
      className={twMerge(
        standardBorderCard,
        'flex md:mx-4 text-sm bg-zinc-300 dark:bg-neutral-800 p-3.75 my-0.25 !mx-0 border-0 rounded-none first:rounded-t-xl last:rounded-b-xl'
      )}
    >
      <div className="md:flex justify-between items-center w-full">
        <div className="md:w-1/3">
          <ManualOrderbookItem
            isCollBid={isCollBid}
            canShowAssetModal={isTokenBid}
            key={`${order.id} ${order.chainId}`}
            order={editableCartItem}
            collectionSlug={order.collectionSlug ?? ''}
          />
        </div>

        <div className="md:w-1/6 md:flex-col flex justify-between md:mt-0 mt-2">
          <div
            className={twMerge(secondaryTextColor, 'font-medium text-sm text-gray-800 dark:text-gray-800 capitalize')}
          >
            Order type
          </div>
          <div className="text-base font-semibold text-neutral-700 dark:text-white">
            {orderType === 'listings'
              ? 'Listing'
              : orderType === 'bids-placed'
              ? isCollBid
                ? 'Collection Bid'
                : 'Bid'
              : 'Offer'}
          </div>
          {/* {order.validUntil && isDesktop ? (
            <div className={twMerge(secondaryTextColor, 'text-xs font-medium')}>Expires {format(order.validUntil)}</div>
          ) : null} */}
        </div>

        <div className="md:w-1/6 md:flex-col flex justify-between md:mt-0 mt-2">
          <div
            className={twMerge(secondaryTextColor, 'font-medium text-sm text-gray-800 dark:text-gray-800 capitalize')}
          >
            Price
          </div>
          <div className="text-amber-700 text-17 font-supply font-normal">
            <EthPrice ethClassName="font-body font-normal" label={`${nFormatter(startPriceEth, 2)}`} />
          </div>
        </div>

        {orderType === 'listings' || orderType === 'bids-placed' ? (
          <div className="w-1/8 flex justify-center md:justify-end">
            <Button
              variant={
                addedToEditCart &&
                (cartType === CartType.TokenList ||
                  cartType === CartType.TokenBid ||
                  cartType === CartType.CollectionBid)
                  ? 'primary'
                  : 'outline'
              }
              disabled={!isActionable}
              className="text-white dark:text-neutral-200 dark:bg-white bg-neutral-200 px-5 py-2.5 rounded-l-6 mr-0.25"
              onClick={() => {
                if (!isConnected) {
                  return;
                }
                const newCartType =
                  orderType === 'listings'
                    ? CartType.TokenList
                    : isCollBid
                    ? CartType.CollectionBid
                    : CartType.TokenBid;
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
              <EditIcon />
            </Button>

            <Button
              className="text-white dark:text-neutral-200 dark:bg-white bg-neutral-200 px-5 py-2.5 rounded-r-6"
              variant={addedToCancelCart && cartType === CartType.Cancel ? 'primary' : 'outline'}
              disabled={!isActionable}
              onClick={() => {
                if (!isConnected) {
                  return;
                }
                const newCartType = CartType.Cancel;
                editableCartItem.cartType = newCartType;
                setCartType(newCartType);
                if (isCollBid) {
                  toggleCollSelection(editableCartItem as ERC721CollectionCartItem);
                } else {
                  toggleNFTSelection(editableCartItem as ERC721TokenCartItem);
                }
              }}
            >
              <DeleteIcon />
            </Button>
          </div>
        ) : null}

        {orderType === 'offers-received' ? (
          <div className="flex items-center gap-2.5 justify-end">
            {order.validUntil ? (
              <div
                className={twMerge(
                  secondaryTextColor,
                  'text-xs hidden font-medium rounded-5  px-1.75 bg-light-borderLight dark:bg-zinc-700 dark:text-gray-800 py-0.5 my-2 text-right'
                )}
              >
                Expires {format(order.validUntil)}
              </div>
            ) : null}
            <AButton
              primary
              className="w-full md:w-auto rounded-6 border-0 py-2.5 px-5 font-semibold text-white dark:text-neutral-200"
              disabled={!isActionable}
              onClick={() => {
                if (!isConnected) {
                  return;
                }
                const newCartType = CartType.AcceptOffer;
                editableCartItem.cartType = newCartType;
                if (isNFTSelectable(editableCartItem as ERC721TokenCartItem)) {
                  setCartType(newCartType);
                  toggleNFTSelection(editableCartItem as ERC721TokenCartItem);
                }
              }}
            >
              {addedToEditCart && cartType === CartType.AcceptOffer ? '✓' : ''} Accept Offer
              <span className="md:hidden">
                {order.validUntil ? (
                  <div
                    className={twMerge(
                      secondaryTextColor,
                      'text-xs hidden font-medium rounded-5  px-1.75 bg-light-borderLight dark:bg-zinc-700 dark:text-gray-800 py-0.5 my-2 text-right'
                    )}
                  >
                    Expires {format(order.validUntil)}
                  </div>
                ) : null}
              </span>
            </AButton>
          </div>
        ) : null}
      </div>
    </div>
  );
};
