import { ScrollLoader } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { TokenCard, TokenListCard } from './token-card';
import { TokenFetcherAlt } from './token-fetcher';
import { ErrorOrLoading } from '../error-or-loading';
import { Erc721TokenOffer } from '../types';
import { useCollectionTokenFetcher } from '../useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { TokenCardModal } from './token-card-modal';
import { useState } from 'react';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';

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

export const TokensGrid = ({ className = '', onClick, isSelected, isSelectable, wrapWidth = 0, listMode }: Props) => {
  const { collection } = useDashboardContext();
  const [data, setData] = useState<ERC721CardData>();

  const modalOpen = !!data;
  const setModalOpen = () => setData(undefined);

  // TODO: `collection.address` param shouldn't be of type `string | undefined` cus it sends an unnecessary request to an empty collection
  const { data: cardData, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection?.address);

  const noData = cardData.length === 0;

  let contents;

  if (error || isLoading || noData) {
    contents = <ErrorOrLoading error={!!error} noData={noData} />;
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
                    onClickDetails={setData}
                  />
                );
              })}
            </div>

            {hasNextPage && (
              <ScrollLoader
                onFetchMore={() => {
                  fetch(true);
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
                      onClick?.(data);
                    }}
                    onClickDetails={setData}
                  />
                );
              })}
            </div>

            {hasNextPage && (
              <ScrollLoader
                onFetchMore={() => {
                  fetch(true);
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

      {data && (
        <TokenCardModal data={data as Required<ERC721CardData>} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}

      <div className="h-1/3" />
    </div>
  );
};
