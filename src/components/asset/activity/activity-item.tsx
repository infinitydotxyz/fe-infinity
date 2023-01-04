import { EventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { format } from 'timeago.js';
import { NftActivity } from '@infinityxyz/lib-frontend/types/dto/collections/nfts';
import { BaseCollection, Token } from '@infinityxyz/lib-frontend/types/core';

// the backend adds teh collectionData to the NFtActivity
export interface NftEventRec extends NftActivity {
  collectionData?: BaseCollection;
}

interface Props {
  item: NftEventRec;
  token?: Token;
}

export const ActivityItem = ({ item, token }: Props) => {
  const toValue = item.toDisplayName ? ellipsisAddress(item.toDisplayName) : ellipsisAddress(item.to);

  let imageUrl = item.image || item.collectionData?.metadata?.profileImage;
  if (token && token.image?.originalUrl) {
    imageUrl = token.image.originalUrl;
  }

  return (
    <div>
      <div className="bg-theme-light-200 px-10 py-6 rounded-3xl flex items-center font-heading mt-4">
        <NextLink href={`/asset/${item.chainId}/${item.address}/${item.tokenId}`}>
          <EZImage className="w-16 h-16 max-h-[80px] rounded-2xl overflow-clip" src={imageUrl} />
        </NextLink>
        <div className="flex justify-between w-full mx-8">
          <div className="w-1/6">
            {/* <div className="font-bold font-body">
              <a href={`/collection/${item.collectionSlug}`}>{item.collectionName}</a>
            </div> */}
            <div className="text-gray-400">Token</div>
            <div>
              <a href={`/asset/${item.chainId}/${item.address}/${item.tokenId}`}>{ellipsisAddress(item.tokenId)}</a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Event</div>
            <div className="font-bold">
              <a href={`${item.externalUrl}`} target="_blank" rel="noopener noreferrer">
                {EventTypeNames[item.type]}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Price</div>
            <div className="font-bold overflow-hidden">{item.price ? <EthPrice label={`${item.price}`} /> : '—'}</div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Date</div>
            <div className="font-bold">
              <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                {format(item.timestamp)}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">From</div>
            <div className="font-bold">
              <NextLink href={`/profile/${item.from}`}>
                {item.fromDisplayName ? ellipsisAddress(item.fromDisplayName) : ellipsisAddress(item.from)}
              </NextLink>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">{toValue ? 'To' : ''}</div>
            <div className="font-bold">
              <NextLink href={`/profile/${item.to}`}>{toValue}</NextLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
