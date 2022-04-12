import React, { useState, useEffect, FunctionComponent } from 'react';
import { Layout } from 'src/components/common/layout';
import { FetchMore } from 'src/components/common';
import { apiGet } from 'src/utils';
import { CollectionCard } from 'src/components/common';
import debounce from 'lodash/debounce';

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

const fetchCollections = async (query: string, cursor: undefined | string) => {
  const API_ENDPOINT = '/collections/search';
  const response = await apiGet(API_ENDPOINT, {
    query: {
      query,
      limit: 24,
      cursor
    }
  });
  return response;
};

const ExplorePage: FunctionComponent = () => {
  const [collections, setCollections] = useState<CollectionSearchDto[]>([]);
  const [query, setQuery] = useState('');

  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<undefined | string>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);

  const handleFetchMore = async () => {
    const response = await fetchCollections(query, cursor);
    if (response.error) {
      setError(response.error);
    } else {
      const result = response.result as CollectionSearchArrayDto;
      setCollections([...collections, ...result.data]);
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);
    }
  };

  const handleChange = async (value: string) => {
    setQuery(value);
    searchCollections(value);
  };

  const searchCollections = debounce(async (value: string) => {
    const response = await fetchCollections(value, undefined);
    if (response.error) {
      setError(response.error);
      setCollections([]);
    } else {
      const result = response.result as CollectionSearchArrayDto;
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);
      setCollections([...result.data]);
    }
  }, 300);

  useEffect(() => {
    handleFetchMore();
  }, []);

  if (error) {
    console.error(error);
    return (
      <Layout title={'Explore - Error'}>
        <p>Error: Fetching Data Failed.</p>
      </Layout>
    );
  }

  return (
    <Layout title="Explore" className="grid place-items-center">
      {/* <SearchBox searchKeyWord={query} onChange={handleChange} /> */}
      <h1 className="text-2xl font-body font-bold mb-3">All collections</h1>
      <input
        value={query}
        className="w-full border border-gray-500 focus:ring-0 py-2 my-2 pl-3 pr-10 text-lg leading-5 text-gray-900 "
        onChange={(event) => handleChange(event.target.value)}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 ">
        {collections.map((collection) => (
          <CollectionCard key={collection.slug} collection={collection} />
        ))}
      </div>
      {hasNextPage && <FetchMore onFetchMore={handleFetchMore} />}
    </Layout>
  );
};

export default ExplorePage;
