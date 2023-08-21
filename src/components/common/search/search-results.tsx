import { ellipsisString, nFormatter } from 'src/utils';
import { CollectionSearchResultData, NftSearchResultData } from 'src/utils/types';
import { BlueCheck } from '../blue-check';
import { EthSymbol } from '../eth-price';
import { EZImage } from '../ez-image';
import { SearchResult } from './types';
import { twMerge } from 'tailwind-merge';
import { secondaryTextColor } from 'src/utils/ui-constants';

const CollectionSearchResult = ({ item }: { item: CollectionSearchResultData }) => {
  return (
    <div className="truncate py-1">
      <div className="flex items-center">
        <EZImage className="w-8 h-8 rounded-lg overflow-hidden mr-4" src={item?.profileImage} />

        <div className="truncate flex-1 space-y-1">
          <div className="flex items-center">
            <div className="truncate">{item?.name}</div>{' '}
            {item?.hasBlueCheck ? <BlueCheck className="w-6 ml-1" /> : null}
          </div>
          <div className={twMerge('md:flex gap-x-3 items-center text-left', secondaryTextColor)}>
            <div className="text-xs">
              Floor: {nFormatter(item?.floorPrice)} {EthSymbol}
            </div>
            <div className="text-xs">
              All time vol: {nFormatter(item?.allTimeVolume)} {EthSymbol}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NftSearchResult = ({ item }: { item: NftSearchResultData }) => {
  return (
    <div className="flex items-center space-x-4 truncate py-1">
      <EZImage className="w-8 h-8 rounded-lg overflow-hidden" src={item.image} />
      <div className="">{ellipsisString(item?.tokenId)}</div>
    </div>
  );
};

export const getSearchResultKey = (item: SearchResult) => {
  if ('address' in item) {
    return `${item.address}`;
  } else if ('tokenId' in item) {
    return `${item.collectionAddress}:${item.tokenId}`;
  }
};

export const SearchResultItem = ({ item }: { item: SearchResult }) => {
  if ('address' in item) {
    return <CollectionSearchResult item={item} />;
  } else if ('tokenId' in item) {
    return <NftSearchResult item={item} />;
  } else {
    return <></>;
  }
};
