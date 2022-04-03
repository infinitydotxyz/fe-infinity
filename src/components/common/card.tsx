import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Dropdown } from './dropdown';
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
          className="flex-1"
          onClick={() => {
            addBuyCartItem({
              collectionName: data.collectionName ?? '(no name)',
              collectionAddress: data.tokenAddress ?? '(no address)',
              imageUrl: data.image ?? '',
              tokenName: data.title ?? '(no name)',
              tokenId: data.tokenAddress ?? '(no address)',
              isSellOrder: false
            });
            setOrderDrawerOpen(true);
          }}
        >
          <span className="font-medium">Buy</span> {data.price} ETH
        </Button>
        <div className="border border-gray-300 rounded-3xl ml-1 pt-1 w-10 h-10 flex justify-center items-center text-lg">
          <Dropdown
            toggler={<AiOutlineEye className="w-10" />}
            items={[
              { label: 'Action 1', onClick: console.log },
              { label: 'Action 2', onClick: console.log }
            ]}
          />
        </div>
      </footer>
    </div>
  );
}
