import { BLANK_IMG, ellipsisAddress, getChainScannerBase } from 'src/utils';
import { EthPrice, NextLink, BGImage } from 'src/components/common';
import { FeedEvent } from './feed-item';
import { format } from 'timeago.js';
import { FeedEventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';

interface Props {
  event: FeedEvent;
}

export const ActivityItem = ({ event }: Props) => {
  return (
    <div>
      <div className="bg-gray-100 p-10 rounded-2xl flex items-center font-heading">
        <NextLink href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
          {event.image ? (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={event.image} />
          ) : (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={BLANK_IMG} />
          )}
        </NextLink>
        <div className="flex justify-between w-full mx-8">
          <div className="w-1/6">
            <div className="text-black font-bold font-body">
              <a href={`/collection/${event.collectionSlug}`}>{event.collectionName}</a>
            </div>
            <div>
              {/* <a
                href={`${getChainScannerBase(event.chainId)}/tx/${event.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ellipsisAddress(event.txHash)}
              </a> */}
              <a href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
                {ellipsisAddress(event.tokenId)}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Event</div>
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(event.chainId)}/tx/${event.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {FeedEventTypeNames[event.type]}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Price</div>
            <div className="font-bold">{event.price ? <EthPrice label={`${event.price}`} /> : '—'}</div>
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
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(event.chainId)}/tx/${event.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {format(event.timestamp)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
