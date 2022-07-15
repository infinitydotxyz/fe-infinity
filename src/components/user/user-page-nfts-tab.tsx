import { useEffect, useState } from 'react';
import { ChainId, ERC721CardData, Token } from '@infinityxyz/lib-frontend/types/core';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { GalleryBox } from '../gallery/gallery-box';
import { SendNFTsDrawer } from '../market/order-drawer/send-nfts-drawer';
import { UserProfileDto } from './user-profile-dto';
import { twMerge } from 'tailwind-merge';
import { CardAction, EthPrice } from '../common';
import { CancelModal } from '../asset';
import { apiGet } from 'src/utils';
import { LowerPriceModal } from '../asset/modals/lower-price-modal';
import { WaitingForTxModal } from '../market/order-drawer/waiting-for-tx-modal';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

type Props = {
  userInfo: UserProfileDto;
  forTransfers?: boolean;
  className?: string;
  listClassName?: string;
};

const fetchTokenData = async (chainId: string, collection: string, tokenId: string) => {
  const NFT_API_ENDPOINT = `/collections/${chainId}:${collection}/nfts/${tokenId}`;
  return apiGet(NFT_API_ENDPOINT);
};

export const UserPageNftsTab = ({ userInfo, forTransfers, className = '', listClassName = '' }: Props) => {
  const { user, chainId } = useAppContext();
  const { setCartItemCount, hasOrderDrawer } = useDrawerContext();
  const {
    addCartItem,
    setOrderDrawerOpen,
    ordersInCart,
    cartItems,
    removeCartItem,
    updateOrders,
    orderDrawerOpen,
    setPrice
  } = useOrderContext();

  const [showTransferDrawer, setShowTransferDrawer] = useState(false);
  const [nftsForTransfer, setNftsForTransfer] = useState<ERC721CardData[]>([]);
  // const [showCancelModal, setShowCancelModal] = useState(false);

  const [cancellingToken, setCancellingToken] = useState<Token | null>(null);
  const [loweringPriceToken, setLoweringPriceToken] = useState<Token | null>(null);
  const [currentPrice, setCurrentPrice] = useState('');
  const [sendTxHash, setSendTxHash] = useState('');

  useEffect(() => {
    if (orderDrawerOpen && !hasOrderDrawer()) {
      setShowTransferDrawer(true);
    }
  }, [orderDrawerOpen]);

  useEffect(() => {
    setCartItemCount(nftsForTransfer.length);
  }, [nftsForTransfer]);

  // find & remove this item in cartItems & all orders' cartItems:
  const findAndRemove = (data: ERC721CardData | undefined) => {
    const foundItemIdx = cartItems.findIndex(
      (item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId
    );
    removeCartItem(cartItems[foundItemIdx]);
    ordersInCart.forEach((order) => {
      order.cartItems = order.cartItems.filter(
        (item) => !(item.collectionAddress === data?.address && item.tokenId === data?.tokenId)
      );
    });
    updateOrders(ordersInCart.filter((order) => order.cartItems.length > 0));
  };

  const isAlreadyAdded = (data: ERC721CardData | undefined) => {
    // check if this item was already added to cartItems or order.
    const found1 =
      cartItems.find((item) => item.collectionAddress === data?.address && item.tokenId === data.tokenId) !== undefined;
    let found2 = false;
    for (const order of ordersInCart) {
      const foundInOrder = order.cartItems.find(
        (item) => item.collectionAddress === data?.address && item.tokenId === data.tokenId
      );
      if (foundInOrder) {
        found2 = true;
        break;
      }
    }
    return found1 || found2;
  };

  const isMyProfile = user?.address === userInfo?.address;

  const onClickAddToOrder = (data: ERC721CardData | undefined) => {
    if (isAlreadyAdded(data)) {
      findAndRemove(data);
      return;
    }
    const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0;
    setPrice(`${price}`);
    addCartItem({
      chainId: data?.chainId as ChainId,
      collectionName: data?.collectionName ?? '',
      collectionAddress: data?.tokenAddress ?? '',
      collectionImage: data?.cardImage ?? data?.image ?? '',
      collectionSlug: data?.collectionSlug ?? '',
      tokenImage: data?.image ?? '',
      tokenName: data?.name ?? '',
      tokenId: data?.tokenId ?? '-1',
      isSellOrder: false,
      attributes: data?.attributes ?? []
    });
  };

  const onClickListing = (data: ERC721CardData | undefined) => {
    // for Listings
    if (isAlreadyAdded(data)) {
      findAndRemove(data);
      return;
    }
    addCartItem({
      chainId: data?.chainId as ChainId,
      collectionName: data?.collectionName ?? '',
      collectionAddress: data?.tokenAddress ?? '',
      collectionImage: data?.cardImage ?? data?.image ?? '',
      collectionSlug: data?.collectionSlug ?? '',
      tokenImage: data?.image ?? '',
      tokenName: data?.name ?? '',
      tokenId: data?.tokenId ?? '-1',
      isSellOrder: true,
      attributes: data?.attributes ?? []
    });
    if (cartItems.length < 1) {
      setOrderDrawerOpen(true); // only show when adding the first time.
    }
  };

  const cardActions: CardAction[] = [
    {
      label: (data) => {
        if (isAlreadyAdded(data)) {
          return <div className="font-normal">✓ Added</div>;
        }
        if (!isMyProfile) {
          return <div className="font-normal">Add to order</div>;
        } else {
          // for Sending
          if (forTransfers === true) {
            const found = nftsForTransfer.find((o) => o.id === data?.id);
            return <div className="font-normal">{found ? '✓' : ''} Send</div>;
          }
          // for Listings
          if (typeof data?.orderSnippet?.listing?.orderItem?.startPriceEth !== 'undefined') {
            return (
              <div className="font-normal flex justify-center">
                <EthPrice label={`${data?.orderSnippet?.listing?.orderItem?.startPriceEth}`} className="mr-2" />
                Relist
              </div>
            );
          }
          return <div className="font-normal">List</div>;
        }
      },
      onClick: (ev, data) => {
        if (!isMyProfile) {
          onClickAddToOrder(data);
          return;
        }
        // for Sending
        if (forTransfers === true && data) {
          const found = nftsForTransfer.find((o) => o.id === data.id);
          if (found) {
            const arr = nftsForTransfer.filter((o: ERC721CardData) => o.id !== data.id);
            setNftsForTransfer(arr);
            if (arr.length === 0) {
              setShowTransferDrawer(false);
              setOrderDrawerOpen(false);
            }
          } else {
            const arr = [...nftsForTransfer, data];
            setNftsForTransfer(arr);
            if (arr.length === 1) {
              setShowTransferDrawer(true);
            }
          }
          return;
        }
        onClickListing(data);
      }
    }
  ];

  return (
    <div>
      <div className={twMerge(`mt-20 ${className}`)}>
        <GalleryBox
          pageId="PROFILE"
          getEndpoint={userInfo?.address ? `/user/${userInfo?.address}/nfts` : ''}
          userAddress={userInfo?.address}
          filterShowedDefault={false}
          showFilterSections={['COLLECTIONS']}
          showSort={false}
          cardProps={{
            cardActions,
            getDropdownActions: (data) => {
              if (!isMyProfile) {
                return null;
              }
              if (forTransfers === true) {
                return null;
              }
              if (typeof data?.orderSnippet?.listing?.orderItem?.startPriceEth !== 'undefined') {
                return [
                  {
                    label: 'Lower price',
                    onClick: async () => {
                      const { result } = await fetchTokenData(chainId, data.address ?? '', data.tokenId ?? '');
                      setLoweringPriceToken(result);
                      setCurrentPrice(`${data?.orderSnippet?.listing?.orderItem?.startPriceEth}`);
                    }
                  },
                  {
                    label: 'Cancel listing',
                    onClick: async () => {
                      const { result } = await fetchTokenData(chainId, data.address ?? '', data.tokenId ?? '');
                      setCancellingToken(result);
                    }
                  }
                ];
              }
              return null;
            }
          }}
          className={twMerge(`mt-[-82px] ${listClassName}`)}
        />
      </div>

      {!user && <div>Please connect your wallet.</div>}

      <SendNFTsDrawer
        open={showTransferDrawer}
        onClose={() => {
          setShowTransferDrawer(false);
          setOrderDrawerOpen(false);
        }}
        nftsForTransfer={nftsForTransfer}
        onClickRemove={(removingItem) => {
          const arr = nftsForTransfer.filter((o: ERC721CardData) => o.id !== removingItem.id);
          setNftsForTransfer(arr);
          if (arr.length === 0) {
            setShowTransferDrawer(false);
            setOrderDrawerOpen(false);
          }
        }}
        onSubmit={(hash) => {
          setSendTxHash(hash);
        }}
      />

      {loweringPriceToken && (
        <LowerPriceModal
          isOpen={true}
          onClose={() => setLoweringPriceToken(null)}
          token={loweringPriceToken}
          buyPriceEth={currentPrice}
        />
      )}

      {cancellingToken && (
        <CancelModal
          isOpen={true}
          onClose={() => setCancellingToken(null)}
          collectionAddress={cancellingToken.collectionAddress ?? ''}
          token={cancellingToken}
        />
      )}

      {sendTxHash && <WaitingForTxModal title={'Sending NFTs'} txHash={sendTxHash} onClose={() => setSendTxHash('')} />}
    </div>
  );
};
