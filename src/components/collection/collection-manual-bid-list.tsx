import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useCollectionBidsFetcher } from 'src/hooks/api/useTokenFetcher';
import { CartType } from 'src/utils/context/CartContext';
import { twMerge } from 'tailwind-merge';
import { BouncingLogo, CenteredContent, Checkbox, ScrollLoader, Spacer } from '../common';
import { StatusIcon } from '../common/status-icon';
import { CollectionManualBidListItem } from './collection-manual-bid-list-item';

interface Props {
  collectionAddress: string;
  collectionChainId: ChainId;
  className?: string;
}

export const CollectionManualBidList = ({ collectionAddress, collectionChainId, className }: Props) => {
  const [onlyCollectionBids, setOnlyCollectionBids] = useState(false);
  const {
    data: orders,
    isLoading,
    hasNextPage,
    fetch
  } = useCollectionBidsFetcher(collectionAddress, collectionChainId, undefined, onlyCollectionBids);

  useEffect(() => {
    fetch(false);

    const interval = setInterval(() => {
      fetch(false);
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [onlyCollectionBids]);

  return (
    <div className={twMerge('min-h-[50vh] pb-20', className)}>
      <div className={twMerge('w-full flex py-2 px-4 space-x-2')}>
        <Spacer />
        <div className="flex text-sm items-cente px-4">
          <StatusIcon status="pending-indefinite" label="Live" />
        </div>
        <Checkbox
          label="Only collections bids"
          checked={onlyCollectionBids}
          onChange={() => {
            setOnlyCollectionBids(!onlyCollectionBids);
          }}
        />
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
              <div className="font-heading mt-4">No Collection Bids</div>
            </CenteredContent>
          ) : null}

          {orders?.map((order) => {
            const orderKind = order.criteria?.kind;
            let orderType = 'Collection Bid' as 'Collection Bid' | 'Token Bid' | 'Attribute Bid';
            if (orderKind === 'collection') {
              order.cartType = CartType.CollectionBid;
            } else if (orderKind === 'token') {
              orderType = 'Token Bid';
              order.cartType = CartType.TokenBid;
            } else if (orderKind === 'attribute') {
              // future-todo support in the future
              orderType = 'Attribute Bid';
              order.cartType = CartType.None;
            }
            return <CollectionManualBidListItem key={order.id} order={order} orderType={orderType} />;
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
