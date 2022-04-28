import { ReactNode } from 'react';
import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';
import { AiOutlineEye } from 'react-icons/ai';
import { Dropdown, DropdownItems } from './dropdown';
import { Button } from './button';
import Link from 'next/link';

type CardAction = {
  label: string | ReactNode;
  onClick: (ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, data?: CardData) => void;
};

export interface CardProps {
  data?: CardData;
  cardActions?: CardAction[];
  dropdownActions?: DropdownItems[];
  className?: string;
}

export const Card = ({ data, cardActions, dropdownActions, className }: CardProps): JSX.Element => {
  const title = (data?.title ?? '').length > 18 ? data?.title?.slice(0, 18) + '...' : data?.title;
  const tokenId = (data?.tokenId ?? '').length > 18 ? data?.tokenId?.slice(0, 18) + '...' : data?.tokenId;

  const buttonJsx = (
    <>
      {(cardActions ?? []).map((cardAction, idx) => {
        return (
          <Button
            key={idx}
            variant="outline"
            className="flex-1 py-3 font-medium"
            onClick={(ev) => {
              cardAction.onClick(ev, data);
            }}
          >
            {cardAction.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className={twMerge(`sm:mx-0 relative ${className ?? ''}`)}>
      <Link href={`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`} passHref={true}>
        <img className="rounded-3xl w-[290px] overflow-hidden" src={data?.image ?? ''} alt="card" />
      </Link>
      {data?.rarityRank && (
        <span className="absolute bg-gray-100 top-3 right-3 py-2 px-3 rounded-3xl">{Math.round(data?.rarityRank)}</span>
      )}

      <div className="p-1 mt-3">
        <div
          className="font-bold"
          title={data?.title}
          // Steve: debugging (will remove when done)
          // onClick={(e) => {
          //   e.preventDefault();
          //   e.stopPropagation();

          //   console.log(JSON.stringify(data, null, '  '));
          // }}
        >
          {title}
        </div>
        <div className="text-secondary" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>

      <footer className="text-sm flex items-center justify-between mt-3">
        {buttonJsx}

        {(dropdownActions ?? []).length > 0 ? (
          <div className="border border-gray-300 rounded-3xl ml-1 pt-1 w-10 h-10 flex justify-center items-center text-lg">
            <Dropdown toggler={<AiOutlineEye className="w-10" />} items={dropdownActions ?? []} />
          </div>
        ) : null}
      </footer>
    </div>
  );
};
