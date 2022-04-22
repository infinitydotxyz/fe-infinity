import { OBOrder, OBTokenInfo } from '@infinityxyz/lib/types/core';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, nameItem, order }: Props4): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const tokenDiv = (collectionName: string, profileImage: string, token?: OBTokenInfo) => {
    let image = profileImage;

    if (token) {
      image = token.tokenImage;
    }

    return (
      <div className="flex gap-2 items-center mb-3">
        <div className={'flex justify-center shrink-0 h-12 overflow-hidden w-12 rounded-2xl'}>
          <img alt={'token image'} src={image} />
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
    // todo: temp fix
    const nfts = order.nfts ?? [];
    for (const n of nfts) {
      if (n.tokens.length > 0) {
        for (const t of n.tokens) {
          nFts.push(tokenDiv(n.collectionName, '', t));
        }
      } else {
        nFts.push(tokenDiv(n.collectionName, n.collectionImage));
      }

      if (!expanded) {
        break;
      }
    }

    return <div onClick={() => setExpanded(!expanded)}>{nFts}</div>;
  }

  return (
    <div className="flex flex-col" onClick={() => setExpanded(!expanded)}>
      <div className="text-gray-500">{title}</div>

      {content}
    </div>
  );
};
