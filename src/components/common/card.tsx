import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';

interface Props {
  data: CardData;
  className?: string;
}

export function Card({ data, className }: Props): JSX.Element {
  return (
    <div className={twMerge(`w-48 ${className ?? ''}`)}>
      <img className="rounded-2xl max-h-80 overflow-hidden" src={data.image ?? ''} alt="card" />
      <div className="p-1">
        <div className="font-bold">{data.title}</div>
        <div className="text-sm">{data.tokenId}</div>
      </div>

      <footer className="text-sm flex items-center justify-between">
        <div className="border border-gray-300 rounded-3xl flex-1 text-center py-2 h-10">
          <span className="font-medium">Buy</span> {data.price} ETH
        </div>
        <div className="border border-gray-300 rounded-3xl ml-1 p-2 w-10 h-10 flex justify-center items-center text-lg">
          <AiOutlineEye />
        </div>
      </footer>
    </div>
  );
}
