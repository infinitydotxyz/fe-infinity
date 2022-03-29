import { BaseCollection, CardData } from '@infinityxyz/lib/types/core';
import { getSearchFriendlyString } from '@infinityxyz/lib/utils';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils/apiUtil';
import { ITEMS_PER_PAGE } from 'src/utils/constants';
import { Button } from '../common';
import { Card } from '../common/card';
import { FetchMore } from '../common/fetch-more';

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
  const [filterShowed, setFilterShowed] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<CardData[]>([]);
  const [currentPage, setCurrentPage] = useState(-1);
  const [dataLoaded, setDataLoaded] = useState(false);

  // const path = `/listings`;
  // const { result, isLoading, isError, error } = useFetch<{ listings: Listing[] }>(path, {
  //   chainId: '1',
  //   collectionName: getSearchFriendlyString(collection?.slug),
  //   offet: 0,
  //   limit: ITEMS_PER_PAGE
  // });
  // console.log('result, isLoading, isError, error', result, isLoading, isError, error);
  // const listings = result?.listings ?? [];

  // const data: CardData[] = listings.map((listing) => ({
  //   id: listing.id,
  //   title: '',
  //   image: listing.metadata.asset.image
  // }));

  const fetchData = async () => {
    setIsFetching(true);
    const newCurrentPage = currentPage + 1;

    const offset = currentPage > 0 ? currentPage * ITEMS_PER_PAGE : 0;
    const { result } = await apiGet(`/listings`, {
      query: {
        offset, // not "startAfter" because this is not firebase query.
        limit: ITEMS_PER_PAGE,
        chainId: '1',
        collectionName: getSearchFriendlyString(collection?.slug)
      }
    });

    const moreData = (result?.listings || []).map((item: Listing) => {
      return {
        id: item.id + item.metadata.asset.address + item.metadata.asset.id,
        title: '',
        image: item.metadata.asset.image
      };
    });

    setIsFetching(false);
    setData([...data, ...moreData]);
    setCurrentPage(newCurrentPage);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        >
          {filterShowed ? 'Hide' : 'Show'} Filter
        </Button>
        <Button variant="outline" className="ml-2">
          Sort
        </Button>
      </header>

      <div className="flex">
        {filterShowed && <div className="w-1/3">Filter Panel</div>}

        <div className="flex flex-wrap mt-6">
          {data.map((item, idx) => {
            return <Card key={idx} data={item} className="ml-8 mt-8" />;
          })}

          {dataLoaded && (
            <FetchMore
              currentPage={currentPage}
              data={data}
              onFetchMore={async () => {
                console.log('***** onFetchMore', data.length);
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
