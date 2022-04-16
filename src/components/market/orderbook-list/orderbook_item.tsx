import { OBOrderSpec, OBOrderSpecToken } from '@infinityxyz/lib/types/core';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrderSpec;
  nameItem?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order }: Props4): JSX.Element => {
  const tokenDiv = (collectionName: string, token?: OBOrderSpecToken) => {
    return (
      <div className="flex gap-2">
        <div className={'flex justify-center shrink-0 h-12 overflow-hidden w-12 rounded-2xl'}>
          <img alt={'collection image'} src="https://picsum.photos/id/1027/200" />
        </div>

        <div className="flex flex-col truncate">
          <div className={'truncate'}>{collectionName}</div>

          {token && (
            <Link passHref href={`/collection/${order.id}`}>
              <div className={'truncate font-bold'}>{token?.tokenName}</div>
            </Link>
          )}
        </div>
      </div>
    );
  };

  if (nameItem) {
    const nFts = [];
    const nfts = order.nfts;
    for (const n of nfts) {
      if (n.tokens.length > 0) {
        for (const t of n.tokens) {
          nFts.push(tokenDiv(n.collectionName, t));
        }
      } else {
        nFts.push(tokenDiv(n.collectionName));
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
