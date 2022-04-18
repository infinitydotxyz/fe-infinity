import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Dropdown, DropdownItems } from './dropdown';
import { Button } from './button';
import Link from 'next/link';

export interface CardProps {
  data: CardData;
  onClick: (data: CardData) => void;
  isSellCard?: boolean;
  dropdownActions?: DropdownItems[];
  className?: string;
}

export function Card({ data, onClick, isSellCard, dropdownActions, className }: Props): JSX.Element {
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
        {data.price ? (
          <>
            <span className="font-medium font-heading">Buy</span> {data.price} ETH
          </>
        ) : (
          <a className="font-medium font-heading">Details</a>
        )}
      </>
    );
  }

  return (
    <div className={twMerge(`sm:mx-0 ${className ?? ''}`)}>
      <Link href={`/asset/${data.chainId}/${data.tokenAddress}/${data.tokenId}`} passHref={true}>
        <a>
          <img className="rounded-2xl w-[290px] overflow-hidden" src={data.image ?? ''} alt="card" />
        </a>
      </Link>
      <div className="p-1 mt-3">
        <div className="font-bold" title={data.title}>
          {title}
        </div>
        <div className="text-secondary" title={data.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between mt-3">
        <Button variant="outline" className="flex-1 py-3" onClick={() => onClick(data)}>
          {buttonContents}
        </Button>

        {(dropdownActions ?? []).length > 0 ? (
          <div className="border border-gray-300 rounded-3xl ml-1 pt-1 w-10 h-10 flex justify-center items-center text-lg">
            <Dropdown toggler={<AiOutlineEye className="w-10" />} items={dropdownActions} />
          </div>
        ) : null}
      </footer>
    </div>
  );
}
