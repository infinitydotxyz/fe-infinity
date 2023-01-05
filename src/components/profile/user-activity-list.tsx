import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { useState } from 'react';
import { useUserActivity } from 'src/hooks/api/useUserActivity';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AFilterPopdown, FeedFilter, filterButtonDefaultOptions } from '../astra/astra-filter-popdown';
import { CenteredContent, ScrollLoader, Spacer, Spinner } from '../common';
import { NftOrderEvent } from '../feed/user-feed-events/nft-order-event';
import { NftSaleEvent } from '../feed/user-feed-events/nft-sale-event';
import { NftTransferEvent } from '../feed/user-feed-events/nft-transfer-event';
import { TokenStakeEvent } from '../feed/user-feed-events/token-stake-event';
import { VoteEvent } from '../feed/user-feed-events/vote-event';

interface Props {
  userAddress?: string;
  types: EventType[];
  forActivity?: boolean;
  forUserActivity?: boolean;
  className?: string;
}

export const UserActivityList = ({ userAddress, types, className }: Props) => {
  const [filter, setFilter] = useState<FeedFilter>({ userAddress, types });
  const { result: activities, isLoading, fetchMore } = useUserActivity(filter.types ?? [], userAddress);

  return (
    <div className={twMerge('min-h-[50vh]', className)}>
      <div className={twMerge(inputBorderColor, 'w-full flex   py-2 border-t-[1px]')}>
        <Spacer />
        <div className="flex flex-row-reverse mb-8 bg-transparent">
          <AFilterPopdown
            options={filterButtonDefaultOptions}
            filter={filter}
            onChange={(f) => {
              setFilter(f);
            }}
          />
        </div>
      </div>
      <div className="space-y-3 pointer-events-auto">
        {!isLoading && activities?.length === 0 ? <div className="font-heading">No results found</div> : null}

        {activities.length > 0 &&
          activities?.map((event, index) => {
            switch (event.type) {
              case EventType.NftListing:
              case EventType.NftOffer:
                return <NftOrderEvent key={`${event.orderItemId} ${index}`} event={event} />;
              case EventType.NftSale:
                return (
                  <NftSaleEvent
                    key={`${event.txHash}-${event.collectionAddress}-${event.tokenId}-${event.type}`}
                    event={event}
                  />
                );
              case EventType.TokensStaked:
              case EventType.TokensUnStaked:
              case EventType.TokensRageQuit:
                return <TokenStakeEvent key={`${event.txHash}-${event.type}`} event={event} />;
              case EventType.UserVote:
              case EventType.UserVoteRemoved:
                return <VoteEvent key={`${event.collectionAddress}-${event.timestamp}-${event.type}`} event={event} />;
              case EventType.NftTransfer:
                return <NftTransferEvent key={`${event.txHash}-${event.type}`} event={event} />;
              default:
                console.error(`Unhandled user event type: ${JSON.stringify(event, null, 2)}`);
                return <></>;
            }
          })}

        <div className="mt-8">
          {isLoading && (
            <CenteredContent>
              <Spinner />
            </CenteredContent>
          )}
        </div>

        <ScrollLoader
          onFetchMore={() => {
            fetchMore();
          }}
        />
      </div>
    </div>
  );
};