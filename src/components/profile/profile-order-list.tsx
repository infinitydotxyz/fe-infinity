import { JsonRpcSigner } from '@ethersproject/providers';
import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useProfileOrderFetcher } from 'src/hooks/api/useOrderFetcher';
import { extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType } from 'src/utils/context/CartContext';
import { fetchOrderNonce } from 'src/utils/orderbook-utils';
import { cancelAllOrders } from 'src/utils/orders';
import { ERC721OrderCartItem, TokensFilter } from 'src/utils/types';
import { borderColor, hoverColorBrandText, primaryBtnBgColorText, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { AOutlineButton } from '../astra/astra-button';
import { APriceFilter } from '../astra/astra-price-filter';
import { BouncingLogo, CenteredContent, EZImage, ScrollLoader, Spacer, toastError, toastSuccess } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { StatusIcon } from '../common/status-icon';
import { ProfileOrderListItem } from './profile-order-list-item';

interface Props {
  userAddress: string;
  className?: string;
}

const DEFAULT_ORDER_TYPE_FILTER = 'offers-made';

export const ProfileOrderList = ({ userAddress, className = '' }: Props) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? 1) as ChainId;
  const { address: user } = useAccount();
  const { setTxnHash } = useAppContext();

  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState<'listings' | 'offers-made' | 'offers-received' | ''>(
    DEFAULT_ORDER_TYPE_FILTER
  );
  const [filter, setFilter] = useState<TokensFilter>({
    orderType: DEFAULT_ORDER_TYPE_FILTER
  });
  const [selectedCollection, setSelectedCollection] = useState<CollectionSearchDto>();
  const { orders, isLoading, hasNextPage, fetch } = useProfileOrderFetcher(50, filter, userAddress);

  const handleCollectionSearchResult = (result: CollectionSearchDto) => {
    setSelectedCollection(result);
    const newFilter = { ...filter };
    newFilter.collections = [result.address];
    setFilter(newFilter);
  };

  const handleCollectionSearchClear = () => {
    setSelectedCollection(undefined);
    const newFilter = { ...filter };
    newFilter.collections = [];
    setFilter(newFilter);
  };

  useEffect(() => {
    fetch(false);

    const interval = setInterval(() => {
      fetch(false);
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [filter]);

  const onClickOrderType = (newType: 'listings' | 'offers-made' | 'offers-received' | '') => {
    setSelectedOrderType(newType);
    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
  };

  return (
    <div className={twMerge('min-h-[50vh]', className)}>
      <div className={twMerge(borderColor, 'w-full flex py-2 px-4 border-t-[1px] space-x-2')}>
        <div className="">
          <CollectionSearchInput
            expanded
            orderSearch
            setSelectedCollection={(value) => {
              handleCollectionSearchResult(value);
            }}
          />
        </div>

        {selectedCollection ? (
          <div className={twMerge('flex items-center rounded-lg border px-2', borderColor)}>
            <div className="flex items-center">
              <EZImage src={selectedCollection.profileImage} className="w-6 h-6 rounded-full mr-2" />
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

        <Spacer />

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
            selectedOrderType === 'listings' ? primaryBtnBgColorText : twMerge(secondaryTextColor, hoverColorBrandText)
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
          className={twMerge('font-medium text-sm', secondaryTextColor, hoverColorBrandText)}
          disabled={isCancellingAll}
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
          Cancel all
        </AOutlineButton>
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

          {orders?.map((order, idx) => {
            const orderCartItem = order as ERC721OrderCartItem;
            orderCartItem.cartType = CartType.Cancel;
            return <ProfileOrderListItem key={idx} order={orderCartItem} orderType={filter.orderType} />;
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
