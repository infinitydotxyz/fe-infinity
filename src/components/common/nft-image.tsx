import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import { BaseCollection } from '@infinityxyz/lib/types/core';

const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

type ApiResponse = {
  result: BaseCollection;
};

interface Props {
  chainId: string;
  collectionAddress: string;
  tokenId?: string;
  src?: string;
  alt?: string;
  [key: string]: string | number | undefined;
}

const NftImage = ({ chainId, collectionAddress, src, alt, ...rest }: Props) => {
  const [unmounted, setUnmounted] = useState(false);
  const [imageUrl, setImageUrl] = useState(src || '');

  const getData = async () => {
    if (!collectionAddress || unmounted) {
      return;
    }
    const { result }: ApiResponse = (await apiGet(`/collections/${chainId}:${collectionAddress}`)) as ApiResponse;
    setImageUrl(result?.metadata.profileImage ?? BLANK_IMG);
  };

  useEffect(() => {
    if (!src) {
      getData();
    }
    return () => {
      setUnmounted(true);
    };
  }, []);

  if (!imageUrl) {
    return null;
  }
  return <img src={imageUrl} {...rest} alt={alt} />;
};

export default NftImage;
