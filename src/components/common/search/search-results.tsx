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

        <div className="space-y-1">
          <div className="flex items-center">
            {item?.name} {item?.hasBlueCheck ? <BlueCheck className="ml-1" /> : null}
          </div>
          <div className={twMerge('flex space-x-3 items-center', secondaryTextColor)}>
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
