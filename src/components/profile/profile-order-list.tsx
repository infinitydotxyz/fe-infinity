import { JsonRpcSigner } from '@ethersproject/providers';
import { ChainId, SupportedCollection } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useProfileOrderFetcher } from 'src/hooks/api/useOrderFetcher';
import { extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { SelectedCollectionType, useProfileContext } from 'src/utils/context/ProfileContext';
import { fetchOrderNonce } from 'src/utils/orderbook-utils';
import { cancelAllOrders } from 'src/utils/orders';
import { ERC721OrderCartItem, TokensFilter } from 'src/utils/types';
import { borderColor, hoverColorBrandText, primaryBtnBgColorText, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { AOutlineButton } from '../astra/astra-button';
import { APriceFilter } from '../astra/astra-price-filter';
import { BouncingLogo, CenteredContent, EZImage, ScrollLoader, toastError, toastSuccess } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { StatusIcon } from '../common/status-icon';
import { ProfileOrderListItem } from './profile-order-list-item';

interface Props {
  userAddress: string;
  isOwner: boolean;
  className?: string;
  selectedCollection?: SupportedCollection;
}

const DEFAULT_ORDER_TYPE_FILTER = 'offers-made';

export const ProfileOrderList = ({ userAddress, isOwner, className = '' }: Props) => {
  const { selectedCollection, setSelectedCollection } = useProfileContext();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { selectedChain, selectedProfileTab } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);
  const { address: user } = useAccount();
  const { setTxnHash } = useAppContext();
  const { setCartType } = useCartContext();

  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<'listings' | 'offers-made' | 'offers-received' | ''>(
    DEFAULT_ORDER_TYPE_FILTER
  );
  const [filter, setFilter] = useState<TokensFilter>({
    orderType: DEFAULT_ORDER_TYPE_FILTER
  });
  const { orders, isLoading, hasNextPage, fetch } = useProfileOrderFetcher(50, filter, userAddress);

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

  const onClickOrderType = (newType: 'listings' | 'offers-made' | 'offers-received' | '') => {
    setSelectedOrderType(newType);
    if (newType === 'listings' || newType === 'offers-received') {
      setCartType(CartType.TokenList);
    } else if (newType === 'offers-made') {
      setCartType(CartType.TokenBid);
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

  return (
    <div className={twMerge('min-h-[50vh] pb-20', className)}>
      <div className={twMerge('flex py-2 px-4')}>
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex justify-between">
            <div className="flex">
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
            </div>

            <div className="flex space-x-2">
              <div className="flex text-sm items-cente px-4">
                <StatusIcon status="pending-indefinite" label="Live" />
              </div>

              <AOutlineButton
                className={twMerge(
                  'font-medium text-sm px-4',
                  selectedOrderType === 'offers-made'
                    ? primaryBtnBgColorText
                    : twMerge(secondaryTextColor, hoverColorBrandText)
                )}
                onClick={() => {
                  onClickOrderType('offers-made');
                }}
              >
                Bids
              </AOutlineButton>

              <AOutlineButton
                className={twMerge(
                  'font-medium text-sm px-4',
                  selectedOrderType === 'listings'
                    ? primaryBtnBgColorText
                    : twMerge(secondaryTextColor, hoverColorBrandText)
                )}
                onClick={() => {
                  onClickOrderType('listings');
                }}
              >
                Listings
              </AOutlineButton>

              <AOutlineButton
                className={twMerge(
                  'font-medium text-sm px-4',
                  selectedOrderType === 'offers-received'
                    ? primaryBtnBgColorText
                    : twMerge(secondaryTextColor, hoverColorBrandText)
                )}
                onClick={() => {
                  onClickOrderType('offers-received');
                }}
              >
                Offers
              </AOutlineButton>

              <APriceFilter filter={filter} setFilter={setFilter} />

              <AOutlineButton
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
              </AOutlineButton>
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

      <div className="flex">
        <div className="w-full pointer-events-auto">
          {isLoading && (
            <div className="">
              <CenteredContent>
                <BouncingLogo />
              </CenteredContent>
            </div>
          )}

          {!isLoading && hasNextPage === false && orders?.length === 0 ? (
            <CenteredContent>
              <div className="font-heading mt-4">
                No{' '}
                {selectedOrderType === 'listings'
                  ? 'Listings'
                  : selectedOrderType === 'offers-made'
                  ? 'Bids'
                  : 'Offers'}
              </div>
            </CenteredContent>
          ) : null}

          {orders?.map((order) => {
            const orderCartItem = order as ERC721OrderCartItem;
            orderCartItem.cartType = CartType.Cancel;
            return <ProfileOrderListItem key={order.id} order={orderCartItem} orderType={filter.orderType} />;
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
