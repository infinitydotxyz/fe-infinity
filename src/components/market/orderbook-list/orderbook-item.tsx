import { OBOrder, OBOrderItem } from '@infinityxyz/lib-frontend/types/core';
import { OBTokenInfoDto } from '@infinityxyz/lib-frontend/types/dto/orders';

import { ReactNode } from 'react';
import { NextLink } from 'src/components/common';
import { useRouter } from 'next/router';
import { BLANK_IMG } from 'src/utils';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order }: Props4): JSX.Element => {
  const router = useRouter();

  if (nameItem) {
    // one collection
    if (order.nfts.length === 1) {
      const nft = order.nfts[0];

      // one item from one collection
      if (nft.tokens.length === 1) {
        const token = nft.tokens[0];
        return (
          <SingleCollectionCell
            image={token?.tokenImage || nft.collectionImage}
            title={nft.collectionName}
            orderNft={nft}
            token={token}
          />
        );
      } else {
        // multiple items from one collection
        return (
          <SingleCollectionCell
            onClickTitle={() => {
              router.push(`/collection/${nft.collectionSlug}`);
            }}
            image={nft.collectionImage}
            title={nft.collectionName}
            count={nft.tokens.length}
          />
        );
      }
    }

    // multiple collections
    if (order.nfts.length > 1) {
      return <MultiCollectionCell nfts={order.nfts} />;
    }
  }

  return (
    <div className="flex flex-col min-w-0">
      <div className="text-gray-500">{title}</div>
      <div className="font-heading">{content}</div>
    </div>
  );
};

type MultiCollectionCellProps = {
  nfts: OBOrderItem[];
};

const MultiCollectionCell = ({ nfts }: MultiCollectionCellProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex -space-x-8 overflow-hidden">
        {nfts.map((nft: OBOrderItem) => {
          return (
            <img
              className="inline-block h-12 w-12 rounded-2xl ring-2 ring-white bg-white"
              src={nft.collectionImage}
              alt=""
            />
          );
        })}
      </div>

      <div className="flex flex-col truncate">
        <div className="truncate font-bold">{nfts.length} Collections</div>
      </div>
    </div>
  );
};

type SingleCollectionCellProps = {
  image: string;
  title: string;
  orderNft?: OBOrderItem;
  token?: OBTokenInfoDto;
  count?: number;
  onClickTitle?: () => void;
};

const SingleCollectionCell = ({
  image,
  title,
  onClickTitle,
  orderNft,
  token,
  count = 0
}: SingleCollectionCellProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex justify-center shrink-0 h-12 w-12">
        <span className="inline-block relative">
          {image ? (
            <img className="h-12 w-12 rounded-full" src={image} alt="" />
          ) : (
            <img className="h-12 w-12 rounded-full" src={BLANK_IMG} alt="" />
          )}

          {count > 1 && (
            <div className="text-xs text-center pt-1 absolute top-0 right-0 block h-6 w-6 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-white">
              {count}
            </div>
          )}
        </span>
      </div>

      <div className={`flex flex-col truncate ${onClickTitle ? 'cursor-pointer' : ''}`}>
        {/* <div className="font-bold whitespace-pre-wrap" onClick={onClickTitle}>
          {title}
        </div> */}
        {orderNft?.collectionSlug ? (
          <NextLink
            href={`/collection/${orderNft?.collectionSlug}`}
            className="font-bold whitespace-pre-wrap"
            title={title}
          >
            {title}
          </NextLink>
        ) : (
          <div className="font-bold whitespace-pre-wrap cursor-auto">{title}</div>
        )}

        {token && (
          <NextLink
            href={`/asset/1/${orderNft?.collectionAddress}/${token.tokenId}`}
            className="whitespace-pre-wrap"
            title={token?.tokenName}
          >
            {token?.tokenName}
          </NextLink>
        )}
      </div>
    </div>
  );
};
