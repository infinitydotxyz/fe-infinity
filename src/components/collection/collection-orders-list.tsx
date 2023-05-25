import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useCollectionOrderFetcher } from 'src/hooks/api/useOrderFetcher';
import { CartType } from 'src/utils/context/CartContext';
import { ERC721OrderCartItem, SORT_FILTERS, TokensFilter } from 'src/utils/types';
import { twMerge } from 'tailwind-merge';
import { APriceFilter } from '../astra/astra-price-filter';
import { BouncingLogo, CenteredContent, ScrollLoader, Spacer } from '../common';
import { StatusIcon } from '../common/status-icon';
import { CollectionOrderListItem } from './collection-order-list-item';

interface Props {
  collectionAddress: string;
  collectionChainId: ChainId;
  className?: string;
}

const DEFAULT_ORDER_TYPE_FILTER = 'offers-made';

export const CollectionOrderList = ({ collectionAddress, collectionChainId, className }: Props) => {
  const [selectedOrderType] = useState<'listings' | 'offers-made'>(DEFAULT_ORDER_TYPE_FILTER);
  const [filter, setFilter] = useState<TokensFilter>({
    orderType: DEFAULT_ORDER_TYPE_FILTER,
    sort: SORT_FILTERS.highestPrice
  });
  const { orders, isLoading, hasNextPage, fetch } = useCollectionOrderFetcher(
    50,
    filter,
    collectionAddress,
    collectionChainId
  );

  useEffect(() => {
    fetch(false);

    const interval = setInterval(() => {
      fetch(false);
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className={twMerge('min-h-[50vh] pb-20', className)}>
      <div className={twMerge('w-full flex py-2 px-4 space-x-2')}>
        <Spacer />
        <div className="flex text-sm items-cente px-4">
          <StatusIcon status="pending-indefinite" label="Live" />
        </div>
        <APriceFilter filter={filter} setFilter={setFilter} />
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
                  : 'Orders'}
              </div>
            </CenteredContent>
          ) : null}

          {orders?.map((order) => {
            const orderCartItem = order as ERC721OrderCartItem;
            const orderType =
              filter.orderType === 'listings'
                ? 'Listing'
                : order.nfts[0].tokens.length === 0
                ? 'Collection Bid'
                : 'Token Bid';
            orderCartItem.cartType = orderType === 'Collection Bid' ? CartType.CollectionOffer : CartType.TokenOffer;
            return <CollectionOrderListItem key={order.id} order={orderCartItem} orderType={orderType} />;
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
