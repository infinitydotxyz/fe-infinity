import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { DebouncedTextField } from 'src/components/common';
import { apiGet } from 'src/utils';

interface Props {
  onClick: (value: BaseCollection) => void;
}

export const AstraSidebar = ({ onClick }: Props) => {
  const [query, setQuery] = useState('');

  const collectionsList = (
    <CollectionList
      query={query}
      onClick={async (collection) => {
        const { result } = await apiGet(`/collections/${collection.chainId}:${collection.address}`);
        const colt = result as BaseCollection;

        onClick(colt);
      }}
    />
  );

  return (
    <div className="flex flex-col pt-3 h-full items-center">
      <DebouncedTextField
        className="px-4 mb-3"
        value={query}
        placeholder="Search"
        onChange={(value) => {
          setQuery(value);
        }}
      />
      <div className="overflow-y-auto overflow-x-hidden w-full px-4">{collectionsList}</div>
    </div>
  );
};
