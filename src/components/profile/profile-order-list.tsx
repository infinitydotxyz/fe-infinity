import { SupportedCollection } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useProfileOrderFetcher } from 'src/hooks/api/useOrderFetcher';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { SelectedCollectionType, useProfileContext } from 'src/utils/context/ProfileContext';
import { TokensFilter } from 'src/utils/types';
import { borderColor, hoverColorBrandText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { BouncingLogo, CenteredContent, EZImage, EthSymbol, ScrollLoader } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { StatusIcon } from '../common/status-icon';
import { ProfileManualOrderListItem } from './profile-manual-order-list-item';
import TabSelector from '../common/TabSelecter';

interface Props {
  userAddress: string;
  isOwner: boolean;
  className?: string;
  selectedCollection?: SupportedCollection;
}

const DEFAULT_ORDER_TYPE_FILTER = 'bids-placed';

export const ProfileOrderList = ({ userAddress, isOwner, className = '' }: Props) => {
  const { selectedCollection, setSelectedCollection } = useProfileContext();
  const { selectedProfileTab } = useAppContext();
  const { setCartType } = useCartContext();
  const [orderType, setOrderType] = useState('Bids');
  const [selectedOrderType, setSelectedOrderType] = useState<'listings' | 'bids-placed' | 'offers-received' | ''>(
    DEFAULT_ORDER_TYPE_FILTER
  );
  const [filter, setFilter] = useState<TokensFilter>({
    orderType: DEFAULT_ORDER_TYPE_FILTER
  });
  const { profileOrders, totalOffersValue, numTokensWithOffers, isLoading, hasNextPage, fetch } =
    useProfileOrderFetcher(50, filter, userAddress);

  const handleCollectionSearchResult = (result: SelectedCollectionType) => {
    const newFilter = { ...filter };
    newFilter.collections = [result.address];
    setFilter(newFilter);
    setSelectedCollection(result);
  };

  const handleCollectionSearchClear = () => {
    const newFilter = { ...filter };
    newFilter.collections = [];
    setFilter(newFilter);
    setSelectedCollection(undefined);
  };

  const onClickOrderType = (newType: 'listings' | 'bids-placed' | 'offers-received') => {
    setSelectedOrderType(newType);
    if (newType === 'listings') {
      setCartType(CartType.TokenList);
    } else if (newType === 'bids-placed') {
      setCartType(CartType.TokenBid);
    } else if (newType === 'offers-received') {
      setCartType(CartType.AcceptOffer);
    }

    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
  };

  useEffect(() => {
    fetch(false);

    const interval = setInterval(() => {
      fetch(false);
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [filter]);

  useEffect(() => {
    if (selectedCollection) {
      handleCollectionSearchResult(selectedCollection);
    } else {
      handleCollectionSearchClear();
    }
  }, [selectedCollection, selectedProfileTab]);
  const orderTypes: {
    [key: string]: 'offers-received' | 'listings' | 'bids-placed';
  } = {
    Offers: 'offers-received',
    Listings: 'listings',
    Bids: 'bids-placed'
  };
  return (
    <div className={twMerge('min-h-[50vh] pb-20', className)}>
      <div className={twMerge('flex py-2.5 md:py-5')}>
        <div className="flex flex-col space-y-2.5 w-full">
          <div className="md:flex justify-between">
            <div className="md:hidden block">
              <TabSelector
                value={orderType}
                setValue={(e) => {
                  setOrderType(e);
                  onClickOrderType(orderTypes[e]);
                }}
                tabItems={Object.keys(orderTypes)}
              />
            </div>
            <div className="flex items-center justify-between md:justify-start gap-2.5">
              <CollectionSearchInput
                expanded
                orderSearch
                setSelectedCollection={(value) => {
                  const selectedColl: SelectedCollectionType = {
                    address: value.address,
                    name: value.name,
                    imageUrl: value.profileImage
                  };
                  handleCollectionSearchResult(selectedColl);
                }}
              />
              {/* <div className="flex text-sm items-cente p-2.5 border border-gray-300 rounded-4"> */}
              <StatusIcon status="pending-indefinite" label="Live" />
              {/* </div> */}
            </div>

            <div className="flex justify-center space-x-2 md:mt-0 mt-2.5">
              {selectedOrderType === 'offers-received' && (
                <div className={twMerge('flex items-center w-fit')}>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">
                      <span className="text-amber-700">{numTokensWithOffers}</span> offers totaling to
                      <span className="text-amber-700 font-normal">
                        <span className="mx-0.5">{EthSymbol}</span>
                        {totalOffersValue}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="hidden md:block">
                <TabSelector
                  value={orderType}
                  setValue={(e) => {
                    setOrderType(e);
                    onClickOrderType(orderTypes[e]);
                  }}
                  tabItems={Object.keys(orderTypes)}
                />
              </div>

              {/* <AOutlineButton
                className={twMerge(
                  'font-medium text-sm',
                  secondaryTextColor,
                  hoverColorBrandText,
                  !isOwner && 'hidden'
                )}
                disabled={isCancellingAll || selectedOrderType === 'offers-received'}
                onClick={async () => {
                  try {
                    if (signer && user) {
                      setIsCancellingAll(true);
                      const minOrderNonce = await fetchOrderNonce(user, chainId as ChainId);
                      const { hash } = await cancelAllOrders(signer as JsonRpcSigner, chainId, minOrderNonce);
                      toastSuccess('Sent txn to chain for execution');
                      setTxnHash(hash);
                    } else {
                      throw 'User is null';
                    }
                  } catch (err) {
                    toastError(extractErrorMsg(err));
                  }
                  setIsCancellingAll(false);
                }}
              >
                Cancel all bids and listings
              </AOutlineButton> */}
            </div>
          </div>

          {selectedCollection ? (
            <div className={twMerge('flex items-center rounded-lg border p-2 w-fit', borderColor)}>
              <div className="flex items-center">
                <EZImage src={selectedCollection.imageUrl} className="w-6 h-6 rounded-full mr-2" />
                <div className="text-sm font-medium">{selectedCollection.name}</div>
              </div>
              <div className="ml-2">
                <MdClose
                  className={twMerge('h-4 w-4 cursor-pointer', hoverColorBrandText)}
                  onClick={() => {
                    handleCollectionSearchClear();
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex" key={selectedOrderType}>
        <div className="w-full pointer-events-auto">
          {isLoading && (
            <div className="">
              <CenteredContent>
                <BouncingLogo />
              </CenteredContent>
            </div>
          )}

          {!isLoading &&
          hasNextPage === false &&
          (selectedOrderType === 'listings' ||
            selectedOrderType === 'bids-placed' ||
            selectedOrderType === 'offers-received') &&
          profileOrders?.length === 0 ? (
            <CenteredContent>
              <div className="font-heading mt-4">
                No{' '}
                {selectedOrderType === 'bids-placed'
                  ? 'Bids'
                  : selectedOrderType === 'listings'
                  ? 'Listings'
                  : 'Offers'}
              </div>
            </CenteredContent>
          ) : null}

          {profileOrders?.map((order) => {
            const orderCartItem = order;
            selectedOrderType === 'offers-received'
              ? (orderCartItem.cartType = CartType.AcceptOffer)
              : (orderCartItem.cartType = CartType.Cancel);
            return (
              <ProfileManualOrderListItem
                key={order.id}
                order={orderCartItem}
                orderType={filter.orderType}
                isOwner={isOwner}
              />
            );
          })}

          {hasNextPage === true ? (
            <ScrollLoader
              onFetchMore={async () => {
                await fetch(true);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
