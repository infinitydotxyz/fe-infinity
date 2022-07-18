import { EventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';
import { EthPrice, EZImage, NextLink, SVG } from 'src/components/common';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { format } from 'timeago.js';
import { FeedEvent } from './user-profile-activity-list';

interface Props {
  event: FeedEvent;
}

export const UserActivityItem = ({ event }: Props) => {
  const buyer = event.buyerDisplayName ? ellipsisAddress(event.buyerDisplayName) : ellipsisAddress(event.buyer);
  return (
    <div>
      <div className="bg-gray-100 px-10 py-6 rounded-3xl flex items-center font-heading">
        <NextLink href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
          <EZImage src={event.image} className="w-16 h-16 rounded-2xl overflow-clip" />
        </NextLink>
        <div className="flex justify-between w-full mx-8 ml-4">
          <div className="w-1/3">
            <div className="text-black font-bold mr-2">
              {/* <a href={`/collection/${event.collectionSlug}`}>{event.collectionName}</a> */}
              <NextLink
                href={`/collection/${event.collectionSlug}`}
                className="font-bold whitespace-pre-wrap flex items-center"
                title={event.collectionSlug}
              >
                {event.collectionName}
                {event?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1" style={{ width: 24 }} /> : null}
              </NextLink>
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
                  {EventTypeNames[event.type]}
                </a>
              ) : (
                EventTypeNames[event.type]
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
            <div className="text-gray-400">Date</div>
            <div className="font-bold" title={new Date(event.timestamp).toLocaleString()}>
              {format(event.timestamp)}
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
            <div className="text-gray-400">{buyer ? 'To' : ''}</div>
            <div className="font-bold">
              <NextLink href={`/profile/${event.buyer}`}>{buyer}</NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
