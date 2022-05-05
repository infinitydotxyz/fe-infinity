import { CardData } from '@infinityxyz/lib/types/core';
import { twMerge } from 'tailwind-merge';

interface Props {
  data: CardData;
  onClick: (data: CardData) => void;
}

export const TokenCard = ({ data, onClick }: Props): JSX.Element => {
  const title = (data?.title ?? '').length > 18 ? data?.title?.slice(0, 18) + '...' : data?.title;
  const tokenId = (data?.tokenId ?? '').length > 18 ? data?.tokenId?.slice(0, 18) + '...' : data?.tokenId;

  return (
    <div
      className={twMerge('overflow-clip shadow-lg', `rounded-2xl w-full h-[290px] relative flex flex-col`)}
      onClick={() => onClick(data)}
    >
      <div
        className={`w-full h-full bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${data?.image})` }}
      />

      {data?.rarityRank && (
        <div className="absolute bg-gray-100 top-3 right-3 py-1 px-3 rounded-3xl">{Math.round(data?.rarityRank)}</div>
      )}

      <div className="mt-3 mb-4 mx-3">
        <div className="font-bold">{title}</div>
        <div className="text-secondary font-heading" title={data?.tokenId}>
          {tokenId}
        </div>
      </div>
    </div>
  );
};
