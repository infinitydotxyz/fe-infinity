import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { AButton } from 'src/components/astra/astra-button';
import { ButtonProps } from 'src/components/common';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { checkOffersToUser } from 'src/utils/orderbookUtils';

type OrderButtonProps = Omit<ButtonProps, 'children'>;

type Props = {
  order: SignedOBOrder;
  outlineButtons?: boolean;
};

export const OrderbookRowButton = ({ order, outlineButtons = false }: Props) => {
  const { user, checkSignedIn } = useOnboardContext();

  const onClickEdit = (order: SignedOBOrder) => {
    console.log('onClickEdit', order); // todo open modal here
  };

  const onClickBidHigher = (order: SignedOBOrder) => {
    console.log('onClickBidHigher', order);
    // add to Cart as a New Buy Order:
    // todo: steve - addCartItem needs to know whether order is a single collection single nft order
    // or single collection multi nft order or a multi-collection order for proper image display
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
