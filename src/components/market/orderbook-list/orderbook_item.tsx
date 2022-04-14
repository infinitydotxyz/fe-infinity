import { OBOrder } from '@infinityxyz/lib/types/core';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props4 = {
  content?: ReactNode;
  title?: string;
  order: OBOrder;
  nameItem?: boolean;
  image?: boolean;
  sortClick?: () => void;
};

export const OrderbookItem = ({ title, content, image, nameItem, order }: Props4): JSX.Element => {
  if (nameItem) {
    return (
      <div className="flex flex-col">
        <Link passHref href={`/collection/${order.id}`}>
          <div className={'truncate'}>{'trendingData.name'}</div>
        </Link>
      </div>
    );
  }

  if (image) {
    return (
      <div className="flex flex-col">
        <div className={'flex justify-center h-12 overflow-hidden w-12 rounded-2xl'}>
          <img alt={'collection image'} src="https://picsum.photos/id/1027/200" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-slate-500">{title}</div>

      {content}
    </div>
  );
};
