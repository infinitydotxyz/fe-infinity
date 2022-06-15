import { useState } from 'react';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { GalleryBox } from '../gallery/gallery-box';
import { TransferDrawer } from '../market/order-drawer/transfer-drawer';
import { UserProfileDto } from './user-profile-dto';

type Props = {
  userInfo: UserProfileDto;
  forTransfers?: boolean;
};

export const UserPageNftsTab = ({ userInfo, forTransfers }: Props) => {
  const { user } = useAppContext();
  const { addCartItem, setOrderDrawerOpen, ordersInCart, cartItems, removeCartItem, updateOrders } = useOrderContext();

  const [showTransferDrawer, setShowTransferDrawer] = useState(false);
  const [nftsForTransfer, setNftsForTransfer] = useState<ERC721CardData[]>([]);

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

  const isMyProfile = user?.address === userInfo?.address;
  return (
    <div>
      <div className="mt-20">
        <GalleryBox
          pageId="PROFILE"
          getEndpoint={`/user/${userInfo?.address}/nfts`}
          userAddress={userInfo?.address}
          filterShowedDefault={false}
          showFilterSections={['COLLECTIONS']}
          showSort={false}
          cardProps={
            isMyProfile
              ? {
                  cardActions: [
                    {
                      label: (data) => {
                        // for Transfers
                        if (forTransfers === true) {
                          return <div className="font-normal">Transfer</div>;
                        }
                        // for Listings
                        if (isAlreadyAdded(data)) {
                          return <div className="font-normal">✓ Added</div>;
                        }
                        return <div className="font-normal">List</div>;
                      },
                      onClick: (ev, data) => {
                        // for Transfers
                        if (forTransfers === true && data) {
                          setNftsForTransfer([...nftsForTransfer, data]);
                          setShowTransferDrawer(true);
                          return;
                        }
                        // for Listings
                        if (isAlreadyAdded(data)) {
                          findAndRemove(data);
                          return;
                        }
                        // console.log('card data', data);
                        addCartItem({
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
                      }
                    }
                  ]
                }
              : undefined
          }
          className="mt-[-82px]"
        />
      </div>

      <TransferDrawer
        open={showTransferDrawer}
        onClose={() => setShowTransferDrawer(false)}
        nftsForTransfer={nftsForTransfer}
        onClickRemove={(removingItem) => {
          const arr = nftsForTransfer.filter((o: ERC721CardData) => o.id !== removingItem.id);
          setNftsForTransfer(arr);
          if (arr.length === 0) {
            setShowTransferDrawer(false);
          }
        }}
      />
    </div>
  );
};
