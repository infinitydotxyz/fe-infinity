import { ChainId, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { ButtonProps } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { checkOffersToUser } from 'src/utils/orderbookUtils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { AButton } from 'src/components/astra';

type OrderButtonProps = Omit<ButtonProps, 'children'>;

type Props = {
  order: SignedOBOrder;
  outlineButtons?: boolean;
};

export const OrderbookRowButton = ({ order, outlineButtons = false }: Props) => {
  const { user, checkSignedIn } = useOnboardContext();

  const getCartItem = (order: SignedOBOrder): OrderCartItem => {
    const cartItem: OrderCartItem = {
      chainId: order?.chainId as ChainId,
      isSellOrder: order?.isSellOrder ?? false
    };

    // one collection
    if (order.nfts.length === 1) {
      const nft = order.nfts[0];
      // one item from one collection
      if (nft.tokens.length === 1) {
        const token = nft.tokens[0];
        cartItem.tokenId = token.tokenId;
        cartItem.tokenName = token.tokenName;
        cartItem.tokenImage = token.tokenImage;
        cartItem.collectionName = nft.collectionName;
        cartItem.collectionAddress = nft.collectionAddress;
        cartItem.collectionImage = nft.collectionImage;
        cartItem.collectionSlug = nft.collectionSlug;
        cartItem.attributes = token.attributes;
        cartItem.hasBlueCheck = nft.hasBlueCheck;
      } else {
        // multiple items from one collection or no tokens specified
        cartItem.collectionName = nft.collectionName;
        cartItem.collectionAddress = nft.collectionAddress;
        cartItem.collectionImage = nft.collectionImage;
        cartItem.collectionSlug = nft.collectionSlug;
        cartItem.hasBlueCheck = nft.hasBlueCheck;
      }
    }

    // multiple collections
    if (order.nfts.length > 1) {
      // todo: steve handle this better
      const nft = order.nfts[0];
      cartItem.collectionName = `${order.nfts.length} Collections`;
      cartItem.collectionImage = nft.collectionImage;
    }

    return cartItem;
  };

  const onClickEdit = (order: SignedOBOrder) => {
    // todo open modal here
  };

  const onClickBidHigher = (order: SignedOBOrder) => {
    // add to Cart as a New Buy Order:
    // todo: steve - addCartItem needs to know whether order is a single collection single nft order
    // or single collection multi nft order  or a multi-collection order for proper image display
    // todo open modal here
  };

  const onClickBuySell = (order: SignedOBOrder) => {
    if (!checkSignedIn()) {
      return;
    }
    console.log('onClickBuySell', order); // todo open modal here
  };

  const isOwner = order.makerAddress === user?.address;

  let buttonProps: OrderButtonProps = { className: 'w-32' };

  if (outlineButtons) {
    buttonProps = { size: 'medium', variant: 'outlineWhite', className: 'w-28' };
  }

  const actionButton = () => {
    if (isOwner) {
      return (
        <AButton {...buttonProps} primary onClick={() => onClickEdit(order)}>
          Edit
        </AButton>
      );
    }
    const isOfferToUser = checkOffersToUser(order, user);
    if (order.isSellOrder) {
      // Sell Order (Listing)
      return (
        <AButton {...buttonProps} primary onClick={() => onClickBuySell(order)}>
          Buy
        </AButton>
      );
    } else if (isOfferToUser === true) {
      // Buy Order (Offer) => show Sell button (if offer made to current user)
      return (
        <AButton {...buttonProps} primary onClick={() => onClickBuySell(order)}>
          Sell
        </AButton>
      );
    } else if (isOfferToUser === false) {
      return (
        <AButton {...buttonProps} primary onClick={() => onClickBidHigher(order)}>
          Bid higher
        </AButton>
      );
    } else {
      return null;
    }
  };

  return actionButton();
};
