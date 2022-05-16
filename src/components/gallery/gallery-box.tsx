import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { apiGet, ApiError } from 'src/utils/apiUtils';
import { Button, Card, CardProps, FetchMore } from 'src/components/common';
import { FilterPanel } from '../filter/filter-panel';
import { GallerySort } from './gallery-sort';
import { twMerge } from 'tailwind-merge';
import { useResizeDetector } from 'react-resize-detector';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionFilterItem } from './collection-filter';

// type Asset = {
//   address: string;
//   collectionName: string;
//   id: string;
//   image: string;
// };
// type ListingMetadata = {
//   asset: Asset;
//   basePriceInEth: number;
// };
// type Listing = {
//   id: string;
//   metadata: ListingMetadata;
// };

type ApiNftData = BaseToken & {
  collectionAddress?: string;
  collectionName?: string;
  collectionSlug?: string;
};

interface GalleryProps {
  collection?: BaseCollection | null;
  cardProps?: CardProps;
  getEndpoint?: string;
  className?: string;
  filterShowedDefault?: boolean;
  pageId?: 'COLLECTION' | 'PROFILE' | undefined;
  showFilterSections?: string[];
}

export const GalleryBox = ({
  collection,
  className,
  cardProps,
  getEndpoint,
  pageId,
  filterShowedDefault,
  showFilterSections
}: GalleryProps) => {
  const { chainId } = useAppContext();
  const { filterState } = useFilterContext();

  const [filterShowed, setFilterShowed] = useState(filterShowedDefault);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [error, setError] = useState<ApiError>(null);
  const [cursor, setCursor] = useState('');
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [gridWidth, setGridWidth] = useState(0);

  const { width, ref } = useResizeDetector();

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCurrentPage = currentPage + 1;
    let newCursor = cursor;
    if (isRefresh) {
      newCurrentPage = 0;
      newCursor = '';
    }

    const offset = currentPage > 0 ? currentPage * ITEMS_PER_PAGE : 0;
    if (pageId === 'COLLECTION' && !filterState.orderBy) {
      filterState.orderBy = 'rarityRank'; // set defaults
      filterState.orderDirection = 'asc';
    }
    if (pageId === 'PROFILE') {
      delete filterState.orderBy;
      delete filterState.orderDirection;
    }

    const { result, error } = await apiGet(
      getEndpoint ?? `/collections/${collection?.chainId}:${collection?.address}/nfts`,
      {
        query: {
          chainId,
          offset,
          limit: ITEMS_PER_PAGE,
          cursor: newCursor,
          // collectionAddresses: ['0x24d0cbd0d5d7b50212251c5dc7cb810e7af71f6a'],
          ...filterState
        }
      }
    );
    setError(error);
    setCursor(result?.cursor);

    let moreData: CardData[] = (result?.data || []).map((item: ApiNftData) => {
      return {
        id: collection?.address + '_' + item.tokenId,
        name: item.metadata?.name,
        title: item.collectionName ?? collection?.metadata?.name,
        collectionName: item.collectionName ?? collection?.metadata?.name,
        collectionSlug: item.collectionSlug ?? '',
        description: item.metadata.description,
        image: item.image.url,
        price: 0,
        chainId: item.chainId,
        tokenAddress: item.collectionAddress ?? collection?.address,
        address: item.collectionAddress ?? collection?.address,
        tokenId: item.tokenId,
        rarityRank: item.rarityRank,
        orderSnippet: item.ordersSnippet,
        hasBlueCheck: item.hasBlueCheck ?? false
      } as CardData;
    });

    // remove any without tokenAddress (seeing bad NFTs in my profile)
    moreData = moreData.filter((x) => x.tokenAddress);

    setIsFetching(false);
    if (isRefresh) {
      setData([...moreData]);
    } else {
      setData([...data, ...moreData]);
    }
    setCurrentPage(newCurrentPage);
  };

  useEffect(() => {
    console.log('filterState', filterState);
    setData([]);
    setCursor('');
    fetchData(true); // refetch data when filterState changed somewhere (ex: from Sort comp, etc.)
  }, [filterState]);

  useEffect(() => {
    if (currentPage < 0 || data.length < currentPage * ITEMS_PER_PAGE) {
      return;
    }
    setDataLoaded(true); // current page's data loaded & rendered.
  }, [currentPage]);

  let gridColumns = 'grid-cols-2';
  let cardHeight = 290;

  if (gridWidth > 0) {
    const cols = Math.round(gridWidth / 290);
    gridColumns = `repeat(${cols}, minmax(0, 1fr))`;

    const w = gridWidth / cols;
    cardHeight = w * 1.2;
  }

  const initialCollections: CollectionFilterItem[] = data.map((item) => {
    return {
      collectionAddress: item.address,
      collectionName: item.collectionName,
      hasBlueCheck: item.hasBlueCheck
    };
  });

  return (
    <div className={twMerge(className, 'flex flex-col')}>
      {data.length > 0 && (
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-right mt-[-73px] pointer-events-none">
          <Button
            variant="outline"
            onClick={() => {
              setFilterShowed((flag) => !flag);
            }}
            className="py-2.5 mr-2 font-heading pointer-events-auto"
          >
            {filterShowed ? 'Hide' : 'Show'} filter
          </Button>
          <GallerySort />
        </div>
      )}

      <div className={twMerge(className, 'flex items-start mt-[60px]')}>
        {filterShowed && (
          <div className="mt-4">
            <FilterPanel
              collection={collection as BaseCollection}
              collectionAddress={collection?.address}
              initialCollections={initialCollections}
              showFilterSections={showFilterSections}
            />
          </div>
        )}

        <div
          ref={ref}
          className={twMerge('w-full grid gap-12  pointer-events-none')}
          style={{ gridTemplateColumns: gridColumns }}
        >
          {isFetching && (
            <>
              <Card height={cardHeight} isLoading={true} className="mt-24" />

              <Card height={cardHeight} isLoading={true} className="mt-24" />

              <Card height={cardHeight} isLoading={true} className="mt-24" />

              <Card height={cardHeight} isLoading={true} className="mt-24" />
            </>
          )}

          {error ? <div className="mt-24">Unable to load data.</div> : null}

          {!error && !isFetching && data.length === 0 ? <div className="mt-24">No results.</div> : null}

          {data.map((item, idx) => {
            return <Card height={cardHeight} key={idx} data={item} {...cardProps} />;
          })}

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={data}
              onFetchMore={async () => {
                // setDataLoaded(false);
                await fetchData();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
