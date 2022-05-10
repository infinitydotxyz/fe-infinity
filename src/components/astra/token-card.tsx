import { CardData } from '@infinityxyz/lib/types/core';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { BGImage } from '../common';

interface Props {
  data: CardData;
  selected: boolean;
  onClick: (data: CardData) => void;
}

export const TokenCard = ({ data, onClick, selected }: Props): JSX.Element => {
  const title = data?.title ?? '';
  const tokenId = data?.tokenId ?? '';

  return (
    <div
      className={twMerge(
        'overflow-clip  border',
        inputBorderColor,
        'rounded-2xl w-full h-[290px] relative flex flex-col',
        selected ? 'outline-4 outline-slate-400 outline-offset-1 outline' : ''
      )}
      onClick={() => onClick(data)}
    >
      <BGImage src={data?.image} />

      {data?.rarityRank && (
        <div className="absolute bg-gray-100 top-3 right-3 py-1 px-3 rounded-3xl">{Math.round(data?.rarityRank)}</div>
      )}

      <div className="mt-3 mb-4 mx-3">
        <div className="font-bold truncate">{title}</div>
        <div className="text-secondary font-heading truncate" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>
    </div>
  );
};
