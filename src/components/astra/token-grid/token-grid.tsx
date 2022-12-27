import { useState, useEffect } from 'react';
import { ScrollLoader } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { twMerge } from 'tailwind-merge';
import { TokenCard, TokenListCard } from './token-card';
import { TokenFetcherAlt } from './token-fetcher';
import { ErrorOrLoading } from '../error-or-loading';
import { Erc721TokenOffer } from '../types';

interface Props {
  tokenFetcher?: TokenFetcherAlt;
  listMode: boolean;
  className?: string;
  wrapWidth?: number;
  onClick?: (data: Erc721TokenOffer) => void;
  isSelected: (data: Erc721TokenOffer) => boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  onLoad: (numItems: number) => void;
}

export const TokensGrid = ({
  tokenFetcher,
  className = '',
  onLoad,
  onClick,
  isSelected,
  isSelectable,
  wrapWidth = 0,
  listMode
}: Props) => {
  const [cardData, setCardData] = useState<Erc721TokenOffer[]>([]);
  const [error, setError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    setCardData([]);
    setLoading(true);
    handleFetch(false);
  }, [tokenFetcher]);

  const handleFetch = async (loadMore: boolean) => {
    if (!tokenFetcher) {
      return;
    }

    const { hasNextPage: fhasNextPage, cardData: fcardData, error: ferror } = await tokenFetcher.fetch(loadMore);

    // can't update react state after unmount
    if (!isMounted()) {
      return;
    }

    setHasNextPage(fhasNextPage);
    setError(ferror);

    if (!ferror) {
      setCardData(fcardData);

      setNoData(fcardData.length === 0);

      onLoad(fcardData.length);
    }

    setLoading(false);
  };

  let contents;

  if (error || loading || noData) {
    contents = <ErrorOrLoading error={error} noData={noData} message="Error" />;
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
                      if (onClick) {
                        return onClick(data);
                      }
                    }}
                  />
                );
              })}
            </div>

            {hasNextPage && (
              <ScrollLoader
                onFetchMore={() => {
                  handleFetch(true);
                }}
              />
            )}
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
                  <TokenCard
                    key={data.id}
                    data={data}
                    selected={isSelected(data)}
                    isSelectable={isSelectable}
                    onClick={(data) => {
                      if (onClick) {
                        return onClick(data);
                      }
                    }}
                  />
                );
              })}
            </div>

            {hasNextPage && (
              <ScrollLoader
                onFetchMore={() => {
                  handleFetch(true);
                }}
              />
            )}
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
