import { ScrollLoader } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { ErrorOrLoading } from '../error-or-loading';
import { Erc721TokenOffer } from '../types';
import { TokenGridItem, TokenListItem } from './token-grid-item';
import { TokenFetcherAlt } from './token-fetcher';

interface Props {
  tokenFetcher?: TokenFetcherAlt;
  listMode: boolean;
  className?: string;
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
    if (listMode) {
      contents = (
        <>
          <div className={twMerge('space-y-1 flex flex-col')}>
            {cardData.map((data) => {
              return (
                <TokenListItem
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
      contents = (
        <>
          <div
            className="grid grid-flow-row-dense gap-2 3xl:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]
                          sm:grid-cols-[repeat(auto-fill,_minmax(167px,_1fr))] grid-cols-[repeat(auto-fit,_minmax(160px,_1fr))]"
          >
            {cardData.map((data) => {
              return (
                <TokenGridItem
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

  return (
    <div className={twMerge('h-full w-full', className)}>
      {contents}
      <div className="h-1/3" />
    </div>
  );
};
