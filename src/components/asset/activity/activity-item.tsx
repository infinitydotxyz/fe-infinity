import { BaseCollection, Token } from '@infinityxyz/lib-frontend/types/core';
import { EventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';
import { NftActivity } from '@infinityxyz/lib-frontend/types/dto/collections/nfts';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { secondaryTextColor, standardBorderCard } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';

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
    <div className={twMerge(standardBorderCard, 'flex items-center mt-4 text-sm')}>
      <EZImage className="w-14 h-14 max-h-[80px] rounded-lg overflow-clip" src={imageUrl} />
      <div className="flex justify-between w-full space-x-2 ml-4">
        <div className="w-1/6">
          {/* <div className="font-bold font-body">
              <a href={`/collection/${item.collectionSlug}`}>{item.collectionName}</a>
            </div> */}
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Token ID</div>
          <div>
            <a href={`/asset/${item.chainId}/${item.address}/${item.tokenId}`}>{ellipsisAddress(item.tokenId)}</a>
          </div>
        </div>
        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Event</div>
          <div className="">{EventTypeNames[item.type]}</div>
        </div>
        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Price</div>
          <div className="overflow-hidden">{item.price ? <EthPrice label={`${item.price}`} /> : '—'}</div>
        </div>
        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>Date</div>
          <div className="">
            <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
              {format(item.timestamp)}
            </a>
          </div>
        </div>
        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>From</div>
          <div className="truncate">
            <NextLink href={`/profile/${item.from}`}>
              {item.fromDisplayName ? ellipsisAddress(item.fromDisplayName) : ellipsisAddress(item.from)}
            </NextLink>
          </div>
        </div>
        <div className="w-1/6">
          <div className={twMerge(secondaryTextColor, 'font-medium')}>{toValue ? 'To' : ''}</div>
          <div className="truncate">
            <NextLink href={`/profile/${item.to}`}>{toValue}</NextLink>
          </div>
        </div>
      </div>
    </div>
  );
};
