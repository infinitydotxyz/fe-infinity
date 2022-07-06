import { BaseToken } from '@infinityxyz/lib-frontend/types/core';

// CollectionSearchDto
export interface CollectionSearchDto {
  description: string;
  address: string;
  chainId: string;
  profileImage: string;
  hasBlueCheck: boolean;
  bannerImage: string;
  slug: string;
  name: string;
}

// CollectionSearchArrayDto
export interface CollectionSearchArrayDto {
  data: CollectionSearchDto[];
  cursor: string;
  hasNextPage: boolean;
}

// NFTArrayDto
export interface NFTArray {
  data: BaseToken[];
  cursor: string;
  hasNextPage: boolean;
}
