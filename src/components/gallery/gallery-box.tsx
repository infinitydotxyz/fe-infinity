import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiGet, ApiError } from 'src/utils/apiUtils';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Card, CardProps, FetchMore } from 'src/components/common';
import { FilterPanel } from '../filter/filter-panel';
import { GallerySort } from './gallery-sort';
import { twMerge } from 'tailwind-merge';

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

type NftItem = BaseToken & {
  collectionAddress?: string;
};

interface GalleryProps {
  collection?: BaseCollection | null;
  cardProps?: CardProps;
  getEndpoint?: string;
  className?: string;
  filterShowedDefault?: boolean;
  pageId?: 'COLLECTION' | 'PROFILE' | undefined;
}

export const GalleryBox = ({
  collection,
  className,
  cardProps,
  getEndpoint,
  pageId,
  filterShowedDefault
}: GalleryProps) => {
  const { filterState } = useFilterContext();

  const [filterShowed, setFilterShowed] = useState(filterShowedDefault);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [error, setError] = useState<ApiError>(null);
  const [cursor, setCursor] = useState('');
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

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
          offset,
          limit: ITEMS_PER_PAGE,
          cursor: newCursor,
          ...filterState
        }
      }
    );
    setError(error);
    setCursor(result?.cursor);

    let moreData: CardData[] = (result?.data || []).map((item: NftItem) => {
      return {
        id: collection?.address + '_' + item.tokenId,
        name: item.metadata?.name,
        collectionName: collection?.metadata?.name,
        title: collection?.metadata?.name,
        description: item.metadata.description,
        image: item.image.url,
        price: 0,
        chainId: item.chainId,
        tokenAddress: item.collectionAddress ?? collection?.address,
        address: item.collectionAddress ?? collection?.address,
        tokenId: item.tokenId,
        rarityRank: item.rarityRank,
        orderSnippet: item.ordersSnippet
      };
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

  return (
    <div className={twMerge(className, 'flex items-start')}>
      {filterShowed && (
        <div className="mt-4">
          <FilterPanel collection={collection as BaseCollection} collectionAddress={collection?.address} />
        </div>
      )}

      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20 mt-[-73px] pointer-events-none">
        {data.length > 0 && (
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-right">
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

        {isFetching && (
          <>
            <Card isLoading={true} className="mt-24" />

            <Card isLoading={true} className="mt-24" />

            <Card isLoading={true} className="mt-24" />

            <Card isLoading={true} className="mt-24" />
          </>
        )}

        {error ? <div className="mt-24">Unable to load data.</div> : null}

        {data.map((item, idx) => {
          return <Card key={idx} data={item} {...cardProps} className="mt-[-30px]" />;
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
  );
};
