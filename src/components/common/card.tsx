import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Dropdown } from './dropdown';
import { Button } from './button';

interface Props {
  data: CardData;
  className?: string;
  onClick: () => void;
  isSellCard: boolean;
}

export function Card({ data, className, onClick, isSellCard }: Props): JSX.Element {
  const title = (data.title ?? '').length > 18 ? data.title?.slice(0, 18) + '...' : data.title;
  const tokenId = (data.tokenId ?? '').length > 18 ? data.tokenId?.slice(0, 18) + '...' : data.tokenId;

  let buttonContents;
  if (isSellCard) {
    buttonContents = (
      <>
        <span className="font-medium">List</span>
      </>
    );
  } else {
    buttonContents = (
      <>
        <span className="font-medium">Buy</span> {data.price} ETH
      </>
    );
  }

  return (
    <div className={twMerge(`w-48 ${className ?? ''}`)}>
      <img className="rounded-2xl max-h-80 overflow-hidden" src={data.image ?? ''} alt="card" />
      <div className="p-1">
        <div className="font-bold" title={data.title}>
          {title}
        </div>
        <div className="text-sm" title={data.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between">
        <Button variant="outline" className="flex-1" onClick={onClick}>
          {buttonContents}
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
