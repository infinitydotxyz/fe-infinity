import { ScrollLoader } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { ErrorOrLoading } from '../error-or-loading';
import { Erc721TokenOffer } from '../types';
import { TokenGridCard, TokenListCard } from './token-card';
import { TokenFetcherAlt } from './token-fetcher';

interface Props {
  tokenFetcher?: TokenFetcherAlt;
  listMode: boolean;
  className?: string;
  wrapWidth?: number;
  onClick?: (data: Erc721TokenOffer) => void;
  isSelected: (data: Erc721TokenOffer) => boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  onLoad: (numItems: number) => void;
  data: Erc721TokenOffer[];
  hasNextPage: boolean;
  onFetchMore: () => void;
  isError?: boolean;
  isLoading?: boolean;
}

export const TokensGrid = ({
  className = '',
  onClick,
  isSelected,
  isSelectable,
  wrapWidth = 0,
  listMode,
  data: cardData,
  hasNextPage,
  onFetchMore,
  isError,
  isLoading
}: Props) => {
  let contents;

  if (cardData.length === 0 || isError || isLoading) {
    contents = <ErrorOrLoading error={!!isError || !!isLoading} noData={cardData.length === 0} />;
  } else {
    if (wrapWidth > 0) {
      if (listMode) {
        contents = (
          <>
            <div className={twMerge('space-y-1 flex flex-col')}>
              {cardData.map((data) => {
                return (
                  <TokenListCard
                    key={data.id}
                    data={data}
                    selected={isSelected(data)}
                    isSelectable={isSelectable}
                    onClick={(data) => {
                      onClick?.(data);
                    }}
                  />
                );
              })}
            </div>

            {hasNextPage && <ScrollLoader onFetchMore={onFetchMore} />}
          </>
        );
      } else {
        let divisor = wrapWidth < 1500 ? 500 : 380;
        divisor = wrapWidth < 950 ? 700 : divisor;

        const cols = Math.round(wrapWidth / divisor);
        const gridColumns = `repeat(${cols}, minmax(0, 1fr))`;

        contents = (
          <>
            <div className={twMerge('grid gap-10')} style={{ gridTemplateColumns: gridColumns }}>
              {cardData.map((data) => {
                return (
                  <TokenGridCard
                    key={data.id}
                    data={data}
                    selected={isSelected(data)}
                    isSelectable={isSelectable}
                    onClick={(data) => {
                      onClick?.(data);
                    }}
                  />
                );
              })}
            </div>

            {hasNextPage && <ScrollLoader onFetchMore={onFetchMore} />}
          </>
        );
      }
    }
  }

  return (
    <div className={twMerge('h-full w-full', className)}>
      {contents}
      <div className="h-1/3" />
    </div>
  );
};
