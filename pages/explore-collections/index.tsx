import React, { useState, FunctionComponent, useCallback } from 'react';
import { Layout } from 'src/components/common/layout';
import debounce from 'lodash/debounce';
import { CollectionGrid } from 'src/components/common/collection-grid';

const ExplorePage: FunctionComponent = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleChange = async (value: string) => {
    setQuery(value);
    setQueryDebounced(value);
  };

  // must use useCallback or it doesn't work
  const setQueryDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    []
  );

  return (
    <Layout title="Explore" padded>
      <h1 className="text-2xl font-body font-bold mb-3">All collections</h1>
      <input
        value={query}
        className="w-full border border-gray-500 focus:ring-0 py-2 my-2 pl-3 pr-10 text-lg leading-5 text-gray-900 "
        onChange={(event) => handleChange(event.target.value)}
      />

      <CollectionGrid query={debouncedQuery} />
    </Layout>
  );
};

export default ExplorePage;
