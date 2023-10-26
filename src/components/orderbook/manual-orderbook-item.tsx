import { ChainId } from '@infinityxyz/lib-frontend/types/core';

import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { BlueCheckInline, EZImage } from 'src/components/common';
import { BasicTokenInfo, ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

type Props1 = {
  isCollBid?: boolean;
  content?: ReactNode;
  order: ERC721TokenCartItem | ERC721CollectionCartItem;
  sortClick?: () => void;
  onClick?: () => void;
  canShowAssetModal?: boolean;
  collectionSlug: string;
};

export const ManualOrderbookItem = ({ isCollBid, order, canShowAssetModal, collectionSlug }: Props1): JSX.Element => {
  const image = isCollBid
    ? (order as ERC721CollectionCartItem).metadata.profileImage
    : (order as ERC721TokenCartItem).image;

  const title = isCollBid
    ? (order as ERC721CollectionCartItem).metadata.name
    : (order as ERC721TokenCartItem).collectionName;

  return (
    <SingleCollectionCell
      collectionSlug={collectionSlug}
      isCollBid={isCollBid}
      canShowAssetModal={canShowAssetModal}
      image={image ?? ''}
      title={title ?? ''}
      order={order}
    />
  );
};

// ==================================================================

type Props3 = {
  isCollBid?: boolean;
  image: string;
  title: string;
  order?: ERC721TokenCartItem | ERC721CollectionCartItem;
  canShowAssetModal?: boolean;
  collectionSlug: string;
};

const SingleCollectionCell = ({ order, image, title, canShowAssetModal, isCollBid, collectionSlug }: Props3) => {
  const [modalOpen, setModalOpen] = useState(false);
  const tokenIdOrAttribute = isCollBid
    ? ''
    : (order as ERC721TokenCartItem).tokenId
    ? (order as ERC721TokenCartItem).tokenId
    : `${(order as ERC721TokenCartItem).criteria?.data?.attribute?.key}:${
        (order as ERC721TokenCartItem).criteria?.data?.attribute?.value
      }`;
  const collectionAddress = isCollBid
    ? (order as ERC721CollectionCartItem).address
    : (order as ERC721TokenCartItem).address ?? '';
  const chainId = isCollBid
    ? (order as ERC721CollectionCartItem).chainId
    : (order as ERC721TokenCartItem).chainId ?? ChainId.Mainnet;
  const hasBlueCheck = isCollBid
    ? (order as ERC721CollectionCartItem).hasBlueCheck
    : (order as ERC721TokenCartItem).hasBlueCheck;

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: tokenIdOrAttribute ?? '',
    collectionAddress: collectionAddress ?? '',
    collectionSlug: collectionSlug ?? '',
    chainId: chainId ?? ChainId.Mainnet
  };

  const router = useRouter();

  useEffect(() => {
    if (basicTokenInfo) {
      const isModalOpen =
        router.query?.tokenId === basicTokenInfo.tokenId &&
        router.query?.collectionAddress === basicTokenInfo.collectionAddress;
      setModalOpen(isModalOpen);
    }
  }, [router.query]);

  return (
    <div className="flex gap-5 items-center">
      {canShowAssetModal && modalOpen && basicTokenInfo && (
        <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />
      )}

      <div className="flex items-center justify-center shrink-0 ">
        <EZImage
          className={twMerge('h-10.5 w-10.5 rounded-lg overflow-clip', canShowAssetModal ? 'cursor-pointer' : '')}
          src={image}
          onClick={() => {
            if (basicTokenInfo && canShowAssetModal) {
              const { pathname, query } = router;
              query['tokenId'] = basicTokenInfo.tokenId;
              query['collectionAddress'] = basicTokenInfo.collectionAddress;
              router.replace({ pathname, query }, undefined, { shallow: true });
            }
          }}
        />
      </div>

      <div className={`flex flex-col truncate`}>
        {collectionAddress && chainId ? (
          <div
            className={twMerge(secondaryTextColor, 'font-medium text-sm text-gray-800 dark:text-gray-800 capitalize')}
          >
            {title}
            {hasBlueCheck === true && <BlueCheckInline />}
          </div>
        ) : null}

        {tokenIdOrAttribute && (
          <div className={twMerge('whitespace-pre-wrap text-base font-semibold text-neutral-700 dark:text-white')}>
            {tokenIdOrAttribute}
          </div>
        )}
      </div>
    </div>
  );
};
