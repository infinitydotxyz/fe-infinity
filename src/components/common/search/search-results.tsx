import { CollectionDisplayData, NftDisplayData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { ellipsisString } from 'src/utils';
import { BlueCheck } from '../blue-check';
import { EZImage } from '../ez-image';
import { SearchResult } from './types';

const CollectionSearchResult = ({ item }: { item: CollectionSearchDto | CollectionDisplayData }) => {
  return (
    <>
      <EZImage className="w-8 h-8 rounded-full overflow-hidden" src={item?.profileImage} />
      <div className="flex-1 truncate font-body text-xs leading-6 tracking-wide">{item?.name}</div>
      {item?.hasBlueCheck ? <BlueCheck className="ml-1" /> : <></>}
    </>
  );
};

const NftSearchResult = ({ item }: { item: NftDisplayData }) => {
  return (
    <>
      <EZImage className="w-10 h-10 rounded-full overflow-hidden" src={item.image} />
      <div className="flex-1 w-20">
        <div className="truncate font-body text-xs leading-6 tracking-wide -mb-2">
          {item?.collectionDisplayData?.name}
        </div>
        <div className="truncate font-body text-xs leading-6 tracking-wide overflow-hidden">
          {ellipsisString(item?.tokenId)}
        </div>
      </div>
      {item?.collectionDisplayData?.hasBlueCheck ? <BlueCheck className="ml-1" /> : <></>}
    </>
  );
};

export const getSearchResultKey = (item: SearchResult) => {
  if ('address' in item) {
    return `${item.address}`;
  } else if ('tokenId' in item) {
    return `${item.collectionDisplayData?.address}:${item.tokenId}`;
  }
};

export const getSearchResultLink = (item: SearchResult) => {
  if ('address' in item) {
    return `/collection/${item.slug}/items`;
  } else if ('tokenId' in item) {
    return `/asset/${item.collectionDisplayData?.chainId ?? '1'}/${item.collectionDisplayData?.address}/${
      item.tokenId
    }`;
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
