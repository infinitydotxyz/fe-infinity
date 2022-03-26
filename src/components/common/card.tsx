import { CardData } from '@infinityxyz/lib/types/core';

interface Props {
  data: CardData;
}

export function Card({ data }: Props): JSX.Element {
  return (
    <div className="w-40 h-60 border rounded-lg">
      <img className="rounded-t-lg" src={data.image ?? ''} alt="card" />
      <footer className="text-sm flex items-center justify-between p-1">
        <div className="">{data.price} ETH</div>
        <div className="">Icon</div>
      </footer>
    </div>
  );
}
