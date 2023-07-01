import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { useEffect } from 'react';
import { useCollectionBidsFetcher } from 'src/hooks/api/useTokenFetcher';
import { CartType } from 'src/utils/context/CartContext';
import { twMerge } from 'tailwind-merge';
import { BouncingLogo, CenteredContent, ScrollLoader, Spacer } from '../common';
import { StatusIcon } from '../common/status-icon';
import { CollectionManualBidListItem } from './collection-manual-coll-bid-list-item';

interface Props {
  collectionAddress: string;
  collectionChainId: ChainId;
  className?: string;
}

export const CollectionManualCollectionBidList = ({ collectionAddress, collectionChainId, className }: Props) => {
  const {
    data: orders,
    isLoading,
    hasNextPage,
    fetch
  } = useCollectionBidsFetcher(collectionAddress, collectionChainId, undefined, true);

  useEffect(() => {
    fetch(false);

    const interval = setInterval(() => {
      fetch(false);
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={twMerge('min-h-[50vh] pb-20', className)}>
      <div className={twMerge('w-full flex py-2 px-4 space-x-2')}>
        <Spacer />
        <div className="flex text-sm items-cente px-4">
          <StatusIcon status="pending-indefinite" label="Live" />
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
              <div className="font-heading mt-4">No Collection Bids</div>
            </CenteredContent>
          ) : null}

          {orders?.map((order) => {
            order.cartType = CartType.CollectionBid;
            return <CollectionManualBidListItem key={order.id} order={order} orderType="Collection Bid" />;
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
