import { ChainId, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useProfileOrderFetcher } from 'src/hooks/api/useOrderFetcher';
import { ellipsisAddress, extractErrorMsg } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { fetchOrderNonce } from 'src/utils/orderbook-utils';
import { cancelAllOrders } from 'src/utils/orders';
import { TokensFilter } from 'src/utils/types';
import { borderColor, hoverColorBrandText, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AOutlineButton } from '../astra/astra-button';
import { ADropdown } from '../astra/astra-dropdown';
import { APriceFilter } from '../astra/astra-price-filter';
import {
  CenteredContent,
  EZImage,
  ScrollLoader,
  Spacer,
  Spinner,
  toastError,
  toastInfo,
  toastSuccess
} from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ProfileOrderListItem } from './profile-order-list-item';

export const DEFAULT_ORDER_TYPE_FILTER = 'listings';

interface Props {
  userAddress: string;
  className?: string;
  toggleOrderSelection: (data: SignedOBOrder) => void;
  isOrderSelected: (data: SignedOBOrder) => boolean;
}

export const ProfileOrderList = ({ userAddress, className = '', toggleOrderSelection, isOrderSelected }: Props) => {
  const { user, chainId, waitForTransaction, getSigner } = useOnboardContext();
  const [isCancellingAll, setIsCancellingAll] = useState(false);
  const [ddLabel, setDdLabel] = useState<string>('Listings');
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
  }, [filter]);

  const onClickAcceptOfferCancelOrder = (order: SignedOBOrder) => {
    if (filter.orderType === 'offers-received') {
      // no op in this release; in future allow users to accept offers
    } else {
      toggleOrderSelection(order);
    }
  };

  const onClickOrderType = (newType: 'listings' | 'offers-made' | 'offers-received' | '') => {
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

        {selectedCollection && (
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
        )}

        <Spacer />

        <ADropdown
          label={ddLabel}
          items={[
            {
              label: 'Listings',
              onClick: () => {
                setDdLabel('Listings');
                onClickOrderType('listings');
              }
            },
            {
              label: 'Offers made',
              onClick: () => {
                setDdLabel('Offers made');
                onClickOrderType('offers-made');
              }
            },
            {
              label: 'Offers received',
              onClick: () => {
                setDdLabel('Offers received');
                onClickOrderType('offers-received');
              }
            }
          ]}
        />

        <APriceFilter filter={filter} setFilter={setFilter} />

        <AOutlineButton
          className={twMerge('font-medium text-sm', secondaryTextColor, hoverColorBrandText)}
          disabled={isCancellingAll}
          onClick={async () => {
            try {
              const signer = getSigner();
              if (signer && user) {
                const minOrderNonce = await fetchOrderNonce(user.address, chainId as ChainId);
                const { hash } = await cancelAllOrders(signer, chainId, minOrderNonce);
                toastSuccess('Sent txn to chain for execution');
                setIsCancellingAll(true);
                waitForTransaction(hash, () => {
                  toastInfo(`Transaction confirmed ${ellipsisAddress(hash)}`);
                });
                setIsCancellingAll(false);
              } else {
                throw 'User is null';
              }
            } catch (err) {
              toastError(extractErrorMsg(err));
            }
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
                <Spinner />
              </CenteredContent>
            </div>
          )}

          {!isLoading && hasNextPage === false && orders?.length === 0 ? (
            <CenteredContent>
              <div className="font-heading mt-4">No Orders</div>
            </CenteredContent>
          ) : null}

          {orders?.map((order, idx) => {
            return (
              <ProfileOrderListItem
                key={idx}
                order={order}
                orderType={filter.orderType}
                selected={isOrderSelected(order)}
                onClickActionBtn={onClickAcceptOfferCancelOrder}
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
