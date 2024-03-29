import { CollectionOrder, CreationFlow, TokenStandard } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useTheme } from 'next-themes';
import { ARoundOutlineButton } from 'src/components/astra/astra-button';
import { ButtonProps, toastError } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { useAccount, useNetwork } from 'wagmi';

type OrderButtonProps = Omit<ButtonProps, 'children'>;

type Props = {
  order: CollectionOrder;
  outlineButtons?: boolean;
  collectionAddress?: string;
  collectionName?: string;
  className?: string;
};

export const OrderbookRowButton = ({
  order,
  outlineButtons = false,
  collectionAddress,
  collectionName,
  className
}: Props) => {
  const { address: user, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);
  const { isNFTSelected, toggleNFTSelection, toggleCollSelection, isCollSelected } = useAppContext();
  const { setCartType } = useCartContext();

  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const cartType = order.isSellOrder
    ? CartType.TokenBuy
    : order.tokenId === 'Collection Bid'
    ? CartType.CollectionBid
    : CartType.TokenBid;

  const token: ERC721TokenCartItem = {
    tokenId: order.tokenId,
    address: collectionAddress ?? '',
    chainId: chainId,
    cartType,
    id: order.id,
    title: '',
    image: order.tokenImage,
    price: order.priceEth,
    collectionName
  };

  const collection: ERC721CollectionCartItem = {
    address: collectionAddress ?? '',
    chainId: chainId,
    cartType: CartType.CollectionBid,
    id: order.id,
    title: '',
    image: order.tokenImage,
    offerPriceEth: order.priceEth,
    tokenStandard: TokenStandard.ERC721,
    hasBlueCheck: false,
    deployer: '',
    deployedAt: 0,
    deployedAtBlock: 0,
    owner: '',
    numOwnersUpdatedAt: 0,
    metadata: {
      name: collectionName ?? '',
      description: '',
      symbol: '',
      profileImage: order.tokenImage,
      bannerImage: '',
      links: {
        timestamp: 0
      }
    },
    slug: '',
    numNfts: 0,
    numTraitTypes: 0,
    indexInitiator: '',
    state: {
      version: 0,
      create: {
        step: CreationFlow.Complete,
        updatedAt: 0,
        error: undefined,
        progress: 0,
        zoraCursor: undefined,
        reservoirCursor: undefined
      },
      export: {
        done: false
      }
    }
  };

  const onClickEdit = (order: CollectionOrder) => {
    console.log('onClickEdit', order);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClickBidHigher = (order: CollectionOrder) => {
    setCartType(cartType);
    if (cartType === CartType.CollectionBid) {
      toggleCollSelection(collection);
    } else {
      toggleNFTSelection(token);
    }
  };

  const onClickBuySell = () => {
    if (!isConnected) {
      toastError('Please connect your wallet', darkMode);
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
        <ARoundOutlineButton {...buttonProps} className={className} onClick={() => onClickEdit(order)}>
          Edit
        </ARoundOutlineButton>
      );
    }
    if (order.isSellOrder && !isOwner) {
      return (
        <ARoundOutlineButton {...buttonProps} className={className} onClick={() => onClickBuySell()}>
          {isNFTSelected(token) ? 'Remove' : 'Add to Cart'}
        </ARoundOutlineButton>
      );
    } else if (!order.isSellOrder && !isOwner) {
      return (
        <ARoundOutlineButton {...buttonProps} className={className} onClick={() => onClickBidHigher(order)}>
          {isCollSelected(collection) ? 'Remove' : 'Bid Higher'}
        </ARoundOutlineButton>
      );
    } else {
      return null;
    }
  };

  return actionButton();
};
