import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';

interface Props {
  data: CardData;
  className?: string;
}

export function Card({ data, className }: Props): JSX.Element {
  return (
    <div className={twMerge(`w-40 h-70 border rounded-xl ${className ?? ''}`)}>
      <img className="rounded-t-lg max-h-80 overflow-hidden" src={data.image ?? ''} alt="card" />
      <div className="p-1">
        <div className="font-bold">{data.title}</div>
        <div>{data.tokenId}</div>
      </div>

      <footer className="text-sm flex items-center justify-between p-1">
        <div className="border rounded-xl flex-1 p-1">Buy</div>
        <div className="border rounded-xl  p-1">{data.price} ETH</div>
      </footer>
    </div>
  );
}
