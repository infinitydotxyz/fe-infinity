import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import { MISSING_IMAGE_URL } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  chainId: string;
  collectionAddress: string;
  tokenId?: string;
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: string | number | undefined;
}

export const NftImage = ({ chainId, collectionAddress, src, alt, className = '', ...rest }: Props) => {
  const [unmounted, setUnmounted] = useState(false);
  const [imageUrl, setImageUrl] = useState(src || '');

  const getData = async () => {
    if (!collectionAddress || unmounted) {
      return;
    }
    const { result } = await apiGet(`/collections/${chainId}:${collectionAddress}`);
    const collection = result as BaseCollection;

    setImageUrl(collection?.metadata.profileImage ?? MISSING_IMAGE_URL);
  };

  useEffect(() => {
    if (!src) {
      getData();
    }
    return () => {
      setUnmounted(true);
    };
  }, []);

  return <img src={imageUrl ? imageUrl : MISSING_IMAGE_URL} {...rest} alt={alt} className={className} />;
};
