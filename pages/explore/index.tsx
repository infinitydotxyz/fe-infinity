import { FunctionComponent } from 'react';
import { PageBox } from 'src/components/common';
import { FetchMore } from 'src/components/common';
// import Link from 'next/link';
import { SearchBox } from 'src/components/filter/search-box';
import { useFetch } from 'src/utils';
import { CollectionCard } from 'src/components/common';

//import { NextPageContext } from 'next';
//import { apiGet } from 'src/utils';
//import { Collection } from '@infinityxyz/lib/types/core';
//import { GalleryBox } from 'src/components/gallery/gallery-box';

export interface CollectionSearchDto {
  description: string;
  address: string;
  chainId: string;
  profileImage: string;
  hasBlueCheck: boolean;
  bannerImage: string;
  slug: string;
  name: string;
}

interface CollectionSearchArrayDto {
  data: CollectionSearchDto[];
  cursor: string;
  hasNextPage: boolean;
}

const ExplorePage: FunctionComponent = () => {
  const API_ENDPOINT = '/collections/search';

  const { result, isLoading, error } = useFetch<CollectionSearchArrayDto>(API_ENDPOINT, {
    query: {
      query: '',
      limit: 100
    }
  });

  if (isLoading) {
    return <PageBox title={'Loading...'} hideTitle></PageBox>;
  }

  if (error || !result) {
    console.error(error);
    return (
      <PageBox title={'Explore - Error'} hideTitle>
        <p>Error: Fetching Data Failed.</p>
      </PageBox>
    );
  }

  const collections = result.data;

  return (
    <PageBox title={'Explore'} hideTitle>
      <h1 className="text-2xl font-body font-bold mb-3">All collections</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 ">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
    </PageBox>
  );
};

export default ExplorePage;
