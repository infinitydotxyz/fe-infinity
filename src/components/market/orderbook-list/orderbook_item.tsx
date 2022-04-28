import { OBOrder, OBOrderItem, OBTokenInfo } from '@infinityxyz/lib/types/core';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order }: Props4): JSX.Element => {
  if (nameItem) {
    // one collection
    if (order.nfts.length === 1) {
      const nft = order.nfts[0];

      // one item from one collection
      if (nft.tokens.length === 1) {
        const token = nft.tokens[0];
        return <SingleCollectionCell image={token.tokenImage} title={nft.collectionName} token={token} />;
        // multiple items from one collection
      } else {
        return (
          <SingleCollectionCell image={nft.collectionImage} title={nft.collectionName} count={nft.tokens.length} />
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
      {content}
    </div>
  );
};

type MultiCollectionCellProps = {
  nfts: OBOrderItem[];
};

const MultiCollectionCell = ({ nfts }: MultiCollectionCellProps) => {
  return (
    <div className="flex gap-2 items-center mb-3">
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
  token?: OBTokenInfo;
  count?: number;
};

const SingleCollectionCell = ({ image, title, token, count = 0 }: SingleCollectionCellProps) => {
  return (
    <div className="flex gap-2 items-center mb-3">
      <div className="flex justify-center shrink-0 h-12 w-12">
        <span className="inline-block relative">
          <img className="h-12 w-12 rounded-2xl" src={image} alt="" />
          {count > 1 && (
            <div className="text-xs text-center pt-1 absolute top-0 right-0 block h-6 w-6 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-white">
              {count}
            </div>
          )}
        </span>
      </div>

      <div className="flex flex-col truncate">
        <div className="truncate">{title}</div>

        {token && (
          <Link passHref href={`/collection/${token.tokenId}`}>
            <div className="truncate font-bold">{token?.tokenName}</div>
          </Link>
        )}
      </div>
    </div>
  );
};
