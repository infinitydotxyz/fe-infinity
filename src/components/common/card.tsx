import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Button } from './button';
import { useOrderContext } from 'src/utils/context/OrderContext';

interface Props {
  data: CardData;
  className?: string;
}

export function Card({ data, className }: Props): JSX.Element {
  const { addBuyCartItem, setOrderDrawerOpen } = useOrderContext();

  const tokenId = (data.tokenId ?? '').length > 18 ? data.tokenId?.slice(0, 18) + '...' : data.tokenId;
  return (
    <div className={twMerge(`w-48 ${className ?? ''}`)}>
      <img className="rounded-2xl max-h-80 overflow-hidden" src={data.image ?? ''} alt="card" />
      <div className="p-1">
        <div className="font-bold">{data.title}</div>
        <div className="text-sm" title={data.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            addBuyCartItem({
              collectionName: data.collectionName ?? '(no name)',
              imageUrl: data.image ?? '',
              tokenName: data.title ?? '(no name)'
            });
            setOrderDrawerOpen(true);
          }}
        >
          <span className="font-medium">Buy</span> {data.price} ETH
        </Button>
        <div className="border border-gray-300 rounded-3xl ml-1 p-2 w-10 h-10 flex justify-center items-center text-lg">
          <AiOutlineEye />
        </div>
      </footer>
    </div>
  );
}
