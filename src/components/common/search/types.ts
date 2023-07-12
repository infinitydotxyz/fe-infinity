import { CollectionDisplayData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { NftSearchResultData } from 'src/utils/types';

export type SearchResult = CollectionSearchDto | CollectionDisplayData | NftSearchResultData;
