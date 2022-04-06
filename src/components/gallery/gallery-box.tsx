import { BaseCollection, BaseToken, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtils';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Button, Card, FetchMore } from 'src/components/common';
import { FilterPanel } from '../filter/filter-panel';
import { GallerySort } from './gallery-sort';

type Asset = {
  address: string;
  collectionName: string;
  id: string;
  image: string;
};
type ListingMetadata = {
  asset: Asset;
  basePriceInEth: number;
};
// type Listing = {
//   id: string;
//   metadata: ListingMetadata;
// };

interface GalleryProps {
  collection: BaseCollection | null;
}

export function GalleryBox({ collection }: GalleryProps) {
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
    const { result } = await apiGet(`/collections/1:${collection?.address}/nfts`, {
      query: {
        offset,
        limit: ITEMS_PER_PAGE,
        ...filterState
      }
    });

    const moreData = (result?.data || []).map((item: BaseToken) => {
      return {
        id: collection?.address + '_' + item.tokenId,
        title: collection?.metadata?.name,
        image: item.image.url,
        price: 0,
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
    <div>
      <header className="text-right">
        <Button
          variant="outline"
          onClick={() => {
            setFilterShowed((flag) => !flag);
          }}
          className="mr-2 text-sm font-heading"
        >
          {filterShowed ? 'Hide' : 'Show'} Filter
        </Button>
        <GallerySort />
      </header>

      <div className="flex items-start">
        {collection && filterShowed && (
          <div className="">
            <FilterPanel collection={collection} collectionAddress={collection?.address} />
          </div>
        )}

        <div className="flex flex-wrap mt-6">
          {isFetching && <div>Loading..</div>}

          {data.map((item, idx) => {
            return (
              <Card
                key={idx}
                data={item}
                className="ml-8 mt-8"
                onClick={() => console.log('click')}
                isSellCard={false}
              />
            );
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
}
