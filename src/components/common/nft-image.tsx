import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import { BLANK_IMG } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  chainId: string;
  collectionAddress: string;
  tokenId?: string;
  src?: string;
  alt?: string;
  [key: string]: string | number | undefined;
}

export const NftImage = ({ chainId, collectionAddress, src, alt, ...rest }: Props) => {
  const [unmounted, setUnmounted] = useState(false);
  const [imageUrl, setImageUrl] = useState(src || '');

  const getData = async () => {
    if (!collectionAddress || unmounted) {
      return;
    }
    const { result } = await apiGet(`/collections/${chainId}:${collectionAddress}`);
    const collection = result as BaseCollection;

    setImageUrl(collection?.metadata.profileImage ?? BLANK_IMG);
  };

  useEffect(() => {
    if (!src) {
      getData();
    }
    return () => {
      setUnmounted(true);
    };
  }, []);

  return <img src={imageUrl ? imageUrl : BLANK_IMG} {...rest} alt={alt} />;
};
