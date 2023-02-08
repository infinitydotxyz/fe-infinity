import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { AButton } from 'src/components/astra/astra-button';
import { ButtonProps } from 'src/components/common';
import { useAccount } from 'wagmi';

type OrderButtonProps = Omit<ButtonProps, 'children'>;

type Props = {
  order: CollectionOrder;
  outlineButtons?: boolean;
};

export const OrderbookRowButton = ({ order, outlineButtons = false }: Props) => {
  const { address: user, isConnected } = useAccount();

  const onClickEdit = (order: CollectionOrder) => {
    console.log('onClickEdit', order); // todo no action in this release
  };

  const onClickBidHigher = (order: CollectionOrder) => {
    console.log('onClickBidHigher', order);
    // todo add to Cart as a New Buy Order:
    // todo: steve - addCartItem needs to know whether order is a single collection single nft order
    // or single collection multi nft order or a multi-collection order for proper image display
  };

  const onClickBuySell = (order: CollectionOrder) => {
    if (!isConnected) {
      return;
    }
    console.log('onClickBuySell', order); // todo: add to cart here
  };

  const isOwner = user && order.maker === user;

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
    if (order.isSellOrder && !isOwner) {
      return (
        <AButton {...buttonProps} primary onClick={() => onClickBuySell(order)}>
          Buy
        </AButton>
      );
    } else if (!order.isSellOrder && !isOwner) {
      return (
        <AButton {...buttonProps} primary onClick={() => onClickBidHigher(order)}>
          Bid Higher
        </AButton>
      );
    } else {
      return null;
    }
  };

  return actionButton();
};
