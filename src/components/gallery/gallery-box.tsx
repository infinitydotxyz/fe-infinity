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
}

export function GalleryBox({ collection, cardProps }: GalleryProps) {
  const { filterState } = useFilterContext();

  const [filterShowed, setFilterShowed] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    let newCurrentPage = currentPage + 1;
    if (isRefresh) {
      newCurrentPage = 0;
    }

    const offset = currentPage > 0 ? currentPage * ITEMS_PER_PAGE : 0;
    if (!filterState.orderBy) {
      filterState.orderBy = 'rarityRank'; // set defaults
      filterState.orderDirection = 'asc';
    }
    const { result } = await apiGet(`/collections/${collection?.chainId}:${collection?.address}/nfts`, {
      query: {
        offset,
        limit: ITEMS_PER_PAGE,
        ...filterState
      }
    });

    const moreData: CardData[] = (result?.data || []).map((item: BaseToken) => {
      return {
        id: collection?.address + '_' + item.tokenId,
        title: collection?.metadata?.name,
        image: item.image.url,
        price: 0,
        chainId: item.chainId,
        tokenAddress: collection?.address,
        tokenId: item.tokenId
      };
    });

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
    fetchData(true);
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
