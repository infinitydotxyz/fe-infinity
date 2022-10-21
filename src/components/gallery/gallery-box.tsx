import { BaseCollection, CollectionAttributes, ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { defaultFilter, useFilterContext } from 'src/utils/context/FilterContext';
import { Button, ErrorOrLoading } from 'src/components/common';
import { CardProps } from 'src/components/token-card/card';
import { FilterPanel } from '../filter/filter-panel';
import { GallerySort } from './gallery-sort';
import { twMerge } from 'tailwind-merge';
import { useResizeDetector } from 'react-resize-detector';
import { useRouter } from 'next/router';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { TokenFetcher, TokenFetcherCache } from './token-fetcher';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { CollectionNftSearchInput } from '../common/search/collection-nft-search-input';
import { CardGrid } from '../token-card/card-grid';

interface Props {
  collection?: BaseCollection | null;
  collectionAttributes?: CollectionAttributes;
  cardProps?: CardProps;
  getEndpoint?: string;
  className?: string;
  filterShowedDefault?: boolean;
  pageId?: 'COLLECTION' | 'PROFILE';
  showCollectionsFilter?: boolean;
  showSort?: boolean;
  showNftSearch?: boolean;
  userAddress?: string; // for User's NFTs and User's Collection Filter
}

export const GalleryBox = ({
  collection,
  collectionAttributes,
  className = '',
  cardProps,
  getEndpoint,
  pageId,
  filterShowedDefault = false,
  showCollectionsFilter = false,
  showSort = true,
  showNftSearch = false,
  userAddress = ''
}: Props) => {
  const [cardData, setCardData] = useState<ERC721CardData[]>([]);
  const [error, setError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const { chainId } = useOnboardContext();
  const router = useRouter();
  const { filterState, setFilterState } = useFilterContext();
  const [filterShowed, setFilterShowed] = useState(filterShowedDefault);
  const [tokenFetcher, setTokenFetcher] = useState<TokenFetcher>();

  const [gridWidth, setGridWidth] = useState(0);

  const { width, ref } = useResizeDetector();
  const isMounted = useIsMounted();

  const paddedImages = collection?.metadata.displayType === 'padded';

  useEffect(() => {
    setFilterState(defaultFilter);
  }, [router.query]);

  useEffect(() => {
    if (getEndpoint) {
      setTokenFetcher(
        TokenFetcherCache.shared().fetcher(
          userAddress,
          pageId ?? '',
          filterState,
          chainId,
          getEndpoint ?? '',
          collection?.address ?? '',
          collection?.metadata?.name ?? ''
        )
      );
    }
  }, [getEndpoint, filterState, router.query]);

  useEffect(() => {
    setCardData([]);
    setHasNextPage(false);
    setError(false);
    setLoading(true);
    handleFetch(false);
  }, [tokenFetcher]);

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  const handleFetch = async (loadMore: boolean) => {
    if (tokenFetcher) {
      const { hasNextPage: hasNp, cardData: cd, error: err } = await tokenFetcher.fetch(loadMore);

      // can't update react state after unmount
      if (!isMounted()) {
        return;
      }

      setHasNextPage(hasNp);
      setError(err);

      if (!err) {
        setCardData(cd);
        setNoData(cd.length === 0);
      }
    }
    setLoading(false);
  };

  let contents;

  if (error || loading || noData) {
    contents = <ErrorOrLoading error={error} noData={noData} />;
  } else {
    let width = 0;

    if (gridWidth > 0) {
      width = gridWidth;

      if (filterShowed) {
        width -= 360;
      }
    }

    contents = (
      <CardGrid
        cardData={cardData}
        handleFetch={handleFetch}
        hasNextPage={hasNextPage}
        paddedImages={paddedImages}
        width={width}
        cardProps={cardProps}
      />
    );
  }

  return (
    <div ref={ref} className={twMerge(className, 'flex flex-col')}>
      <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-right mt-[-73px] pointer-events-none flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setFilterShowed((flag) => !flag);
          }}
          className="pointer-events-auto"
        >
          {filterShowed ? 'Hide' : 'Show'} filter
        </Button>
        {showSort ? <GallerySort /> : null}
      </div>

      {showNftSearch && (
        <div className="w-full flex justify-end">
          <div className="mt-4 w-1/4">
            <CollectionNftSearchInput expanded slug={collection?.slug ?? ''}></CollectionNftSearchInput>
          </div>
        </div>
      )}

      <div className={twMerge(className, 'flex items-start mt-[60px]')}>
        {filterShowed && (
          <FilterPanel
            collectionAttributes={collectionAttributes}
            collectionAddress={collection?.address}
            showCollectionsFilter={showCollectionsFilter}
          />
        )}

        {contents}
      </div>
    </div>
  );
};
