import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { EthPrice, NextLink } from 'src/components/common';
import { FeedEvent } from './feed-item';
import { FeedEventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';

interface Props {
  event: FeedEvent;
}

export const UserActivityItem = ({ event }: Props) => {
  return (
    <div>
      <div className="bg-gray-100 p-10 rounded-2xl flex items-center font-heading">
        <NextLink
          href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}
          className="w-16 max-h-[80px] rounded-[50%]"
        >
          <img src={event.image} alt="NFT Image" />
        </NextLink>
        <div className="flex justify-between w-full mx-8 ml-4">
          <div className="w-1/6">
            <div className="text-black font-bold">
              <a href={`/collection/${event.collectionSlug}`}>{event.collectionName}</a>
            </div>
            <div className="text-gray-400">
              <a href={`/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`}>
                {ellipsisAddress(event.tokenId)}
              </a>
            </div>
          </div>
          <div>
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
          <div>
            <div className="text-gray-400">From</div>
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(event.chainId)}/address/${event.seller}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.sellerDisplayName ? ellipsisAddress(event.sellerDisplayName) : ellipsisAddress(event.seller)}
              </a>
            </div>
          </div>
          <div>
            <div className="text-gray-400">To</div>
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(event.chainId)}/address/${event.buyer}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.buyerDisplayName ? ellipsisAddress(event.buyerDisplayName) : ellipsisAddress(event.buyer)}
              </a>
            </div>
          </div>
          <div>
            <div className="text-gray-400">Price</div>
            <div className="font-bold">
              <EthPrice label={`${event.price}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
