import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { EthPrice, NextLink } from 'src/components/common';
import { FeedEvent } from './feed-item';
import { FeedEventTypeNames } from '@infinityxyz/lib/types/core/feed';
import { format } from 'timeago.js';

interface Props {
  event: FeedEvent;
}

export const UserActivityItem = ({ event }: Props) => {
  return (
    <div>
      <div className="bg-gray-100 p-10 rounded-2xl flex items-center font-heading">
        <NextLink href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
          <img src={event.image} alt="NFT Image" className="w-16 h-16 max-h-[80px] rounded-[50%]" />
        </NextLink>
        <div className="flex justify-between w-full mx-8 ml-4">
          <div className="w-1/6">
            <div className="text-black font-bold mr-2">
              <a href={`/collection/${event.collectionSlug}`}>{event.collectionName}</a>
            </div>
            <div className="text-gray-400">
              <a href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
                {ellipsisAddress(event.tokenId)}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Event</div>
            <div className="font-bold">
              {event.txHash ? (
                <a
                  href={`${getChainScannerBase(event.chainId)}/tx/${event.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {FeedEventTypeNames[event.type]}
                </a>
              ) : (
                FeedEventTypeNames[event.type]
              )}
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Price</div>
            <div className="font-bold">
              <EthPrice label={`${event.price}`} />
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">From</div>
            <div className="font-bold">
              <NextLink href={`/profile/${event.seller}`}>
                {event.sellerDisplayName ? ellipsisAddress(event.sellerDisplayName) : ellipsisAddress(event.seller)}
              </NextLink>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">To</div>
            <div className="font-bold">
              <NextLink href={`/profile/${event.buyer}`}>
                {event.buyerDisplayName ? ellipsisAddress(event.buyerDisplayName) : ellipsisAddress(event.buyer)}
              </NextLink>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Date</div>
            <div className="font-bold" title={new Date(event.timestamp).toLocaleString()}>
              {format(event.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
