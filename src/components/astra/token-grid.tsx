import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import React, { useState, useEffect } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { CenteredContent, ScrollLoader, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { NFTArray } from '../../utils/types/collection-types';
import { fetchTokens, tokensToCardData } from './astra-utils';
import { TokenCard } from './token-card';

interface Props2 {
  collection: BaseCollection;
  chainId: string;
  className?: string;
  onClick?: (data: CardData) => void;
  isSelected: (data: CardData) => boolean;
  onLoad: (numItems: number) => void;
}

export const TokensGrid = ({ collection, chainId, className = '', onLoad, onClick, isSelected }: Props2) => {
  const [tokens, setTokens] = useState<BaseToken[]>([]);
  const [error, setError] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const { width, ref } = useResizeDetector();

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  useEffect(() => {
    setTokens([]);
    setLoading(true);
    handleFetch('');
  }, [collection]);

  const handleFetch = async (passedCursor: string) => {
    const response = await fetchTokens(collection.address, chainId, passedCursor);

    if (response.error) {
      setError(response.error);
      setTokens([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const result = response.result as NFTArray;
      let newList = [];

      if (passedCursor) {
        newList = [...tokens, ...result.data];
      } else {
        newList = result.data;
      }

      setTokens(newList);
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);

      onLoad(newList.length);
    }

    setLoading(false);
  };

  if (error) {
    console.error(error);
    return (
      <div className={className}>
        <div>Unable to load data.</div>
      </div>
    );
  }

  let gridColumns = 'grid-cols-2';
  if (gridWidth > 0) {
    const cols = Math.round(gridWidth / 250);
    gridColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }

  let contents;

  if (loading) {
    contents = (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  } else {
    const cardData = tokensToCardData(tokens, collection);

    contents = (
      <>
        <div className={twMerge('grid gap-8')} style={{ gridTemplateColumns: gridColumns }}>
          {cardData.map((data) => {
            return (
              <TokenCard
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
              handleFetch(cursor);
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
