import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';

interface Props {
  data: CardData;
  className?: string;
}

export function Card({ data, className }: Props): JSX.Element {
  return (
    <div className={twMerge(`w-40 h-60 border rounded-lg ${className ?? ''}`)}>
      <img className="rounded-t-lg max-h-80 overflow-hidden" src={data.image ?? ''} alt="card" />

      <footer className="text-sm flex items-center justify-between p-1">
        <div className="">{data.price} ETH</div>
        <div className="">Icon</div>
      </footer>
    </div>
  );
}
