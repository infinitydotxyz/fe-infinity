import { ChainId, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { checkOffersToUser } from 'src/utils/orderbookUtils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

type Props = {
  order: SignedOBOrder;
};

export const OrderbookRowButton = ({ order }: Props) => {
  const { user, checkSignedIn } = useOnboardContext();
  const { fulfillDrawerParams } = useDrawerContext();

  const { addCartItem, setOrderDrawerOpen } = useOrderContext();

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
    addCartItem(getCartItem(order));
    setOrderDrawerOpen(true);
  };

  const onClickBidHigher = (order: SignedOBOrder) => {
    // add to Cart as a New Buy Order:
    // todo: steve - addCartItem needs to know whether order is a single collection single nft order
    // or single collection multi nft order  or a multi-collection order for proper image display
    const cartItem = getCartItem(order);
    addCartItem({
      ...cartItem,
      isSellOrder: false
    });
    setOrderDrawerOpen(true);
  };

  const onClickBuySell = (order: SignedOBOrder) => {
    if (!checkSignedIn()) {
      return;
    }

    fulfillDrawerParams.addOrder(order);
  };

  const isOwner = order.makerAddress === user?.address;

  const actionButton = () => {
    if (isOwner) {
      return (
        <Button className="w-32" onClick={() => onClickEdit(order)}>
          Edit
        </Button>
      );
    }
    const isOfferToUser = checkOffersToUser(order, user);
    if (order.isSellOrder) {
      // Sell Order (Listing)
      return (
        <Button className="w-32" onClick={() => onClickBuySell(order)}>
          Buy
        </Button>
      );
    } else if (isOfferToUser === true) {
      // Buy Order (Offer) => show Sell button (if offer made to current user)
      return (
        <Button className="w-32" onClick={() => onClickBuySell(order)}>
          Sell
        </Button>
      );
    } else if (isOfferToUser === false) {
      return (
        <Button className="w-32" onClick={() => onClickBidHigher(order)}>
          Bid higher
        </Button>
      );
    } else {
      return null;
    }
  };

  return actionButton();
};
