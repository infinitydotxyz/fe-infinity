import React, { useState, useCallback } from 'react';
import { PageBox, CollectionGrid } from 'src/components/common';
import debounce from 'lodash/debounce';

const HomePage = () => {
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
    <PageBox title="All collections">
      <input
        value={query}
        className="w-full border border-gray-500 focus:ring-0 py-2 my-2 pl-3 pr-10 text-lg leading-5 text-gray-900 "
        onChange={(event) => handleChange(event.target.value)}
      />

      <CollectionGrid query={debouncedQuery} />
    </PageBox>
  );
};

export default HomePage;
