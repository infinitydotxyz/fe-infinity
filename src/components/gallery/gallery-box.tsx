import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Card, CardProps, FetchMore, Spinner } from 'src/components/common';
import { FilterPanel } from '../filter/filter-panel';
import { GallerySort } from './gallery-sort';

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

interface GalleryProps {
  collection: BaseCollection | null;
  cardProps?: CardProps;
  getEndpoint?: string;
}

export function GalleryBox({ collection, cardProps, getEndpoint }: GalleryProps) {
  const { filterState } = useFilterContext();

  const [filterShowed, setFilterShowed] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
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
    if (!filterState.orderBy) {
      filterState.orderBy = 'rarityRank'; // set defaults
      filterState.orderDirection = 'asc';
    }
    const { result } = await apiGet(getEndpoint ?? `/collections/${collection?.chainId}:${collection?.address}/nfts`, {
      query: {
        offset,
        limit: ITEMS_PER_PAGE,
        cursor: newCursor,
        ...filterState
      }
    });
    if (result?.hasNextPage === true) {
      setCursor(result?.cursor);
    }

    const moreData: CardData[] = (result?.data || []).map((item: BaseToken) => {
      return {
        id: collection?.address + '_' + item.tokenId,
        title: collection?.metadata?.name,
        image: item.image.url,
        price: 0,
        chainId: item.chainId,
        tokenAddress: collection?.address,
        tokenId: item.tokenId,
        rarityScore: item.rarityScore
      };
    });

    setIsFetching(false);
    if (isRefresh) {
      setData([...moreData]);
      setCursor('');
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
    <div className="flex items-start">
      {collection && filterShowed && (
        <div className="mt-4">
          <FilterPanel collection={collection} collectionAddress={collection?.address} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20 mt-[-70px]">
        {data.length > 0 && (
          <header className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-right mb-[-40px]">
            <Button
              variant="outline"
              onClick={() => {
                setFilterShowed((flag) => !flag);
              }}
              className="py-2.5 mr-2 font-heading"
            >
              {filterShowed ? 'Hide' : 'Show'} filter
            </Button>
            <GallerySort />
          </header>
        )}

        {isFetching && (
          <div className="w-full">
            <Spinner className="ml-8" />
          </div>
        )}

        {data.map((item, idx) => {
          return <Card key={idx} data={item} {...cardProps} />;
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
}
