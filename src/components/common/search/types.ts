import { CollectionDisplayData, NftDisplayData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';

export type SearchResult = CollectionSearchDto | CollectionDisplayData | NftDisplayData;
