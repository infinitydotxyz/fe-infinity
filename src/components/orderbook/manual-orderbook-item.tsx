import { ChainId } from '@infinityxyz/lib-frontend/types/core';

import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { BlueCheckInline, EZImage, NextLink } from 'src/components/common';
import { ellipsisString } from 'src/utils';
import { BasicTokenInfo, ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

type Props1 = {
  isCollBid?: boolean;
  content?: ReactNode;
  title?: string;
  order: ERC721TokenCartItem | ERC721CollectionCartItem;
  nameItem?: boolean;
  sortClick?: () => void;
  onClick?: () => void;
  canShowAssetModal?: boolean;
};

export const ManualOrderbookItem = ({
  isCollBid,
  title,
  content,
  nameItem,
  order,
  canShowAssetModal
}: Props1): JSX.Element => {
  if (nameItem) {
    const image = isCollBid
      ? (order as ERC721CollectionCartItem).metadata.profileImage
      : (order as ERC721TokenCartItem).image;

    const title = isCollBid
      ? (order as ERC721CollectionCartItem).metadata.name
      : (order as ERC721TokenCartItem).collectionName;

    return (
      <SingleCollectionCell
        isCollBid={isCollBid}
        canShowAssetModal={canShowAssetModal}
        image={image ?? ''}
        title={title ?? ''}
        order={order}
      />
    );
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className={twMerge(secondaryTextColor, 'font-medium')}>{title}</div>
      <div className="">{content}</div>
    </div>
  );
};

// ==================================================================

type Props3 = {
  isCollBid?: boolean;
  image: string;
  title: string;
  order?: ERC721TokenCartItem | ERC721CollectionCartItem;
  canShowAssetModal?: boolean;
};

const SingleCollectionCell = ({ order, image, title, canShowAssetModal, isCollBid }: Props3) => {
  const [modalOpen, setModalOpen] = useState(false);
  const tokenId = isCollBid ? '' : (order as ERC721TokenCartItem).tokenId ?? '';
  const collectionAddress = isCollBid
    ? (order as ERC721CollectionCartItem).address
    : (order as ERC721TokenCartItem).address ?? '';
  const chainId = isCollBid
    ? (order as ERC721CollectionCartItem).chainId
    : (order as ERC721TokenCartItem).chainId ?? ChainId.Mainnet;
  const collectionSlug = isCollBid
    ? (order as ERC721CollectionCartItem).slug
    : (order as ERC721TokenCartItem).collectionSlug;
  const hasBlueCheck = isCollBid
    ? (order as ERC721CollectionCartItem).hasBlueCheck
    : (order as ERC721TokenCartItem).hasBlueCheck;

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: tokenId,
    collectionAddress: collectionAddress ?? '',
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
    <div className="flex gap-2 items-center">
      {canShowAssetModal && modalOpen && basicTokenInfo && (
        <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />
      )}

      <div className="flex justify-center shrink-0 h-14 w-14 mr-2">
        <EZImage
          className={twMerge('h-14 w-14 rounded-lg overflow-clip', canShowAssetModal ? 'cursor-pointer' : '')}
          src={image}
          onClick={() => {
            if (basicTokenInfo) {
              const { pathname, query } = router;
              query['tokenId'] = basicTokenInfo.tokenId;
              query['collectionAddress'] = basicTokenInfo.collectionAddress;
              router.replace({ pathname, query }, undefined, { shallow: true });
            }
          }}
        />
      </div>

      <div className={`flex flex-col truncate`}>
        {collectionSlug ? (
          <NextLink
            href={`/collection/${collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            <div className={twMerge(secondaryTextColor, 'font-medium')}>
              {title}
              {hasBlueCheck === true && <BlueCheckInline />}
            </div>
          </NextLink>
        ) : (
          <NextLink
            href={`/collection/${collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            <div>
              {title}
              {hasBlueCheck === true && <BlueCheckInline />}
            </div>
          </NextLink>
        )}

        {tokenId && <div className={twMerge('whitespace-pre-wrap')}>{ellipsisString(tokenId)}</div>}
      </div>
    </div>
  );
};