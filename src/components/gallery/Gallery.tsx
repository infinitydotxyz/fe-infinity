import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtil';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Button } from '../common';
import { Card } from '../common/card';
import { FetchMore } from '../common/fetch-more';
import FilterPanel from '../filter/filter-panel';
import GallerySort from './gallery-sort';

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
type Listing = {
  id: string;
  metadata: ListingMetadata;
};

interface GalleryProps {
  collection: BaseCollection | null;
}

export function Gallery({ collection }: GalleryProps) {
  const { filterState } = useFilterContext();

  const [filterShowed, setFilterShowed] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchData = async (isRefresh = false) => {
    setIsFetching(true);
    console.log('currentPage', currentPage);
    let newCurrentPage = currentPage + 1;
    if (isRefresh) {
      newCurrentPage = 0;
    }

    const offset = currentPage > 0 ? currentPage * ITEMS_PER_PAGE : 0;
    const { result } = await apiGet(`/listings`, {
      query: {
        offset,
        limit: ITEMS_PER_PAGE,
        chainId: '1',
        listingSource: 'infinity',
        collectionIds: collection?.address,
        ...filterState
      }
    });

    const moreData = (result?.listings || []).map((item: Listing) => {
      return {
        id: item.id + item.metadata.asset.address + item.metadata.asset.id,
        title: item.metadata.asset.collectionName,
        image: item.metadata.asset.image,
        price: item.metadata.basePriceInEth,
        tokenId: item.metadata.asset.id
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
          className="mr-2"
        >
          {filterShowed ? 'Hide' : 'Show'} Filter
        </Button>
        <GallerySort />
      </header>

      <div className="flex items-start">
        {filterShowed && (
          <div className="">
            <FilterPanel collectionAddress={collection?.address} />
          </div>
        )}

        <div className="flex flex-wrap mt-6">
          {isFetching && <div>Loading..</div>}

          {data.map((item, idx) => {
            return <Card key={idx} data={item} className="ml-8 mt-8" />;
          })}

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={data}
              onFetchMore={async () => {
                console.log('onFetchMore');
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

export default Gallery;
