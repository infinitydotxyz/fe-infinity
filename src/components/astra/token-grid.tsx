import { CardData } from '@infinityxyz/lib/types/core';
import React, { useState, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { CenteredContent, ScrollLoader, Spinner } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { twMerge } from 'tailwind-merge';
import { TokenCard } from './token-card';
import { TokenFetcher } from './token-fetcher';

interface Props {
  tokenFetcher: TokenFetcher;
  className?: string;
  onClick?: (data: CardData) => void;
  isSelected: (data: CardData) => boolean;
  onLoad: (numItems: number) => void;
}

export const TokensGrid = ({ tokenFetcher, className = '', onLoad, onClick, isSelected }: Props) => {
  const [cardData, setCardData] = useState<CardData[]>([]);
  const [error, setError] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { width, ref } = useResizeDetector();
  const isMounted = useIsMounted();

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  useEffect(() => {
    setCardData([]);
    setLoading(true);
    handleFetch(false);
  }, [tokenFetcher]);

  const handleFetch = async (loadMore: boolean) => {
    const { fhasNextPage, fcardData, ferror } = await tokenFetcher.fetch(loadMore);

    // can't update react state after unmount
    if (!isMounted()) {
      return;
    }

    setHasNextPage(fhasNextPage);
    setError(ferror);

    if (!ferror) {
      setCardData(fcardData);

      onLoad(fcardData.length);
    }

    setLoading(false);
  };

  let contents;
  let cardHeight = 290;

  if (error || loading) {
    contents = <ErrorOrLoading error={error} />;
  } else {
    let gridColumns = 'grid-cols-2';
    if (gridWidth > 0) {
      const cols = Math.round(gridWidth / 290);
      gridColumns = `repeat(${cols}, minmax(0, 1fr))`;

      cardHeight = gridWidth / cols;
    }

    contents = (
      <>
        <div className={twMerge('grid gap-8')} style={{ gridTemplateColumns: gridColumns }}>
          {cardData.map((data) => {
            return (
              <TokenCard
                height={cardHeight}
                key={data.id}
                data={data}
                selected={isSelected(data)}
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
            onFetchMore={async () => {
              handleFetch(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div ref={ref} className={twMerge('h-full w-full', className)}>
      {contents}
    </div>
  );
};

// ====================================================================

interface Props2 {
  error: boolean;
}

export const ErrorOrLoading = ({ error }: Props2) => {
  let contents;

  if (error) {
    contents = <div>Unable to load data</div>;
  } else {
    contents = <Spinner />;
  }

  return (
    <div className="h-full w-full">
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
