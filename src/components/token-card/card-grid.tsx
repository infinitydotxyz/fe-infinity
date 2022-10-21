import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { ScrollLoader } from 'src/components/common';
import { Card, CardProps } from './card';
import { twMerge } from 'tailwind-merge';

interface Props {
  cardData: ERC721CardData[];
  paddedImages: boolean;
  hasNextPage: boolean;
  width: number;
  cardProps?: CardProps;
  handleFetch: (loadMore: boolean) => void;
}

export const CardGrid = ({ cardData, width, hasNextPage, cardProps, paddedImages, handleFetch }: Props) => {
  let gridColumns = 'grid-cols-2';
  let cardHeight = 310;

  if (width > 0) {
    const cols = Math.round(width / cardHeight);
    gridColumns = `repeat(${cols}, minmax(0, 1fr))`;

    const w = width / cols;
    cardHeight = w * 1.2;
  }

  return (
    <div
      className={twMerge('w-full flex-1 grid gap-12 pointer-events-none')}
      style={{ gridTemplateColumns: gridColumns }}
    >
      {cardData.map((item, idx) => {
        return (
          <Card
            key={`${item.address}_${item.tokenId}_${idx}`}
            height={cardHeight}
            data={item}
            {...cardProps}
            paddedImages={paddedImages}
          />
        );
      })}

      {hasNextPage && (
        <ScrollLoader
          onFetchMore={() => {
            handleFetch(true);
          }}
        />
      )}
    </div>
  );
};
