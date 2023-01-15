import { CollectionDisplayData, NftDisplayData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { ellipsisString } from 'src/utils';
import { BlueCheck } from '../blue-check';
import { EZImage } from '../ez-image';
import { SearchResult } from './types';

const CollectionSearchResult = ({ item }: { item: CollectionSearchDto | CollectionDisplayData }) => {
  return (
    <div className="flex items-center space-x-4 truncate py-1">
      <EZImage className="w-8 h-8 rounded-lg overflow-hidden" src={item?.profileImage} />
      <div className="">{item?.name}</div>
      {item?.hasBlueCheck ? <BlueCheck className="ml-1" /> : <></>}
    </div>
  );
};

const NftSearchResult = ({ item }: { item: NftDisplayData }) => {
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
    return `${item.collectionDisplayData?.address}:${item.tokenId}`;
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
