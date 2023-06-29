import { useEffect, useState } from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
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

interface Props {
  order: ERC721TokenCartItem;
  orderType: TokensFilter['orderType'];
}

export const ProfileManualOrderListItem = ({ order, orderType }: Props) => {
  const [startPriceEth] = useState(order.price);
  const { isConnected } = useAccount();
  const { cartType, cartItems, setCartType } = useCartContext();
  const { isNFTSelectable, isNFTSelected, toggleNFTSelection, isCollSelectable, isCollSelected, toggleCollSelection } =
    useAppContext();

  let editableCartItem: ERC721CollectionCartItem | ERC721TokenCartItem;
  const isCollBid = orderType === 'offers-made' && order.criteria?.kind === 'collection'; // adi-todo: fix this
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

  const isActionable = true;

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
    <div className={twMerge(standardBorderCard, 'flex mx-4 text-sm')}>
      <div className="flex justify-between items-center w-full">
        <div className="w-1/3">
          <ManualOrderbookItem
            isCollBid={isCollBid}
            canShowAssetModal={true}
            nameItem={true}
            key={`${order.id} ${order.chainId}`}
            order={editableCartItem}
          />
        </div>

        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Order type</div>
          <div className="">{orderType === 'listings' ? 'Listing' : orderType === 'offers-made' ? 'Bid' : 'Offer'}</div>
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

        {orderType === 'listings' || orderType === 'offers-made' ? (
          <div className="w-1/8 flex justify-end">
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
              className="mr-2"
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
              <FiEdit3 className="w-4 h-4" />
            </Button>

            <Button
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
              <FiTrash2 className="w-4 h-4" />
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
                editableCartItem.cartType = newCartType;
                if (isNFTSelectable(editableCartItem as ERC721TokenCartItem)) {
                  setCartType(newCartType);
                  toggleNFTSelection(editableCartItem as ERC721TokenCartItem);
                }
              }}
            >
              {addedToEditCart && cartType === CartType.TokenList ? '✓' : ''} Sell Now
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
