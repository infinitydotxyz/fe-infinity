import { OBOrder, OBOrderItem } from '@infinityxyz/lib-frontend/types/core';
import { OBTokenInfoDto } from '@infinityxyz/lib-frontend/types/dto/orders';

import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { EZImage, NextLink, SVG } from 'src/components/common';
// import ReactTooltip from 'react-tooltip';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
  onClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order, onClick }: Props4): JSX.Element => {
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
            onClick={onClick}
          />
        );
      } else {
        // multiple items from one collection
        return (
          <SingleCollectionCell
            order={order}
            nfts={order.nfts}
            onClickTitle={() => {
              router.push(`/collection/${nft.collectionSlug}`);
            }}
            image={nft.collectionImage}
            title={nft.collectionName}
            count={nft.tokens.length}
            onClick={onClick}
          />
        );
      }
    }

    // multiple collections
    if (order.nfts.length > 1) {
      return <MultiCollectionCell nfts={order.nfts} onClick={onClick} />;
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
  onClick?: () => void;
};

const MultiCollectionCell = ({ nfts, onClick }: MultiCollectionCellProps) => {
  return (
    <div className="flex gap-2 items-center hover:cursor-pointer" onClick={onClick}>
      <div className="flex -space-x-8 overflow-hidden">
        {nfts.map((nft: OBOrderItem) => {
          return (
            <EZImage
              key={nft.collectionAddress}
              className="inline-block h-12 w-12 rounded-2xl overflow-clip"
              src={nft.collectionImage}
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
  order?: OBOrder;
  image: string;
  title: string;
  orderNft?: OBOrderItem;
  token?: OBTokenInfoDto;
  count?: number;
  onClickTitle?: () => void;
  nfts?: OBOrderItem[];
  onClick?: () => void;
};

const SingleCollectionCell = ({
  order,
  image,
  title,
  onClickTitle,
  orderNft,
  token,
  count = 0,
  nfts,
  onClick
}: SingleCollectionCellProps) => {
  const tokenNames: string[] = [];

  if (nfts && nfts.length && nfts[0].tokens) {
    for (const nft of nfts) {
      for (const token of nft.tokens) {
        tokenNames.push(`Token: ${token.tokenId}`);
      }
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex justify-center shrink-0 h-14 w-14">
        <span
          className="inline-block relative cursor-pointer"
          onClick={() => {
            onClick && onClick();
          }}
        >
          <EZImage className="h-14 w-14 rounded-full overflow-clip" src={image} />

          {count > 1 && (
            <div className="text-xs text-center pt-1 absolute top-0 right-0 block h-6 w-6 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-white">
              {count}
            </div>
          )}
        </span>
      </div>

      <div className={`flex flex-col truncate ${onClickTitle ? 'cursor-pointer' : ''}`}>
        {orderNft?.collectionSlug ? (
          <NextLink
            href={`/collection/${orderNft?.collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            {title}
            {orderNft?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1" style={{ width: 24 }} /> : null}
          </NextLink>
        ) : (
          <NextLink
            href={`/collection/${order?.nfts[0]?.collectionSlug}`}
            className="font-bold whitespace-pre-wrap flex items-center"
            title={title}
          >
            {title}
            {orderNft?.hasBlueCheck === true ? <SVG.blueCheck className="w-4 h-4 ml-1" style={{ width: 24 }} /> : null}
          </NextLink>
        )}

        {count > 1 ? (
          <div>
            {/* <div data-tip data-for={`counter-${order?.id}`}>
              {count} NFTs
            </div>
            <ReactTooltip id={`counter-${order?.id}`} effect="solid">
              <div className="space-y-2">
                {tokenNames.map((name, idx) => (
                  <div key={idx}>{name}</div>
                ))}
              </div>
            </ReactTooltip> */}
          </div>
        ) : (
          <>
            {token && (
              <NextLink
                href={`/asset/1/${orderNft?.collectionAddress}/${token.tokenId}`}
                className="whitespace-pre-wrap text-gray-400"
                title={token?.tokenId}
              >
                {token?.tokenId}
              </NextLink>
            )}
          </>
        )}
      </div>
    </div>
  );
};
