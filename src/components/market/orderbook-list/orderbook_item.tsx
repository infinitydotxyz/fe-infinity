import { OBOrder } from '@infinityxyz/lib/types/core';
import { BigNumberish } from 'ethers';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { useCollectionCache } from './collection-cache';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order }: Props4): JSX.Element => {
  const { nameForCollection } = useCollectionCache();
  const { chainId } = useAppContext();

  const tokenDiv = (tokenId: BigNumberish, collectionName: string) => {
    return (
      <div className="flex gap-2">
        <div className={'flex justify-center shrink-0 h-12 overflow-hidden w-12 rounded-2xl'}>
          <img alt={'collection image'} src="https://picsum.photos/id/1027/200" />
        </div>

        <div className="flex flex-col truncate">
          <Link passHref href={`/collection/${order.id}`}>
            <div className={'truncate font-bold'}>{tokenId.toString()}</div>
          </Link>
          <div className={'truncate'}>{nameForCollection(chainId, collectionName)}</div>
        </div>
      </div>
    );
  };

  if (nameItem) {
    const nFts = [];
    const nfts = order.nfts;
    for (const n of nfts) {
      if (n.tokenIds.length > 0) {
        for (const t of n.tokenIds) {
          nFts.push(tokenDiv(t, n.collection));
        }
      } else {
        nFts.push(tokenDiv(0, n.collection));
      }
    }

    return <div>{nFts}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="text-gray-500">{title}</div>

      {content}
    </div>
  );
};
