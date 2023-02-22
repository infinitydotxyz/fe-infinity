import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { AButton } from 'src/components/astra/astra-button';
import { ButtonProps, toastError } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721TokenCartItem } from 'src/utils/types';
import { useAccount, useNetwork } from 'wagmi';

type OrderButtonProps = Omit<ButtonProps, 'children'>;

type Props = {
  order: CollectionOrder;
  outlineButtons?: boolean;
  collectionAddress?: string;
};

export const OrderbookRowButton = ({ order, outlineButtons = false, collectionAddress }: Props) => {
  const { address: user, isConnected } = useAccount();
  const { chain } = useNetwork();
  const chainId = String(chain?.id) ?? '1';
  const { isNFTSelected, toggleNFTSelection } = useAppContext();
  const { setCartType } = useCartContext();

  const cartType = CartType.TokenOffer;

  const token: ERC721TokenCartItem = {
    tokenId: order.tokenId,
    address: collectionAddress ?? '',
    chainId: chainId,
    cartType,
    id: '',
    title: '',
    image: order.tokenImage,
    orderPriceEth: order.priceEth
  };

  const onClickEdit = (order: CollectionOrder) => {
    console.log('onClickEdit', order);
  };

  const onClickBidHigher = (order: CollectionOrder) => {
    console.log('onClickBidHigher', order);
    // addCartItem needs to know whether order is a single collection single nft order
    // or single collection multi nft order or a multi-collection order for proper image display
  };

  const onClickBuySell = () => {
    if (!isConnected) {
      toastError('Please connect your wallet');
      return;
    }

    setCartType(cartType);
    toggleNFTSelection(token);
  };

  const isOwner = user && trimLowerCase(order.maker) === trimLowerCase(user);

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
        <AButton {...buttonProps} primary onClick={() => onClickBuySell()}>
          {isNFTSelected(token) ? 'Remove' : 'Add to Cart'}
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
