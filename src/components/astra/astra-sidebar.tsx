import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { DebouncedTextField } from 'src/components/common';
import { apiGet } from 'src/utils';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  onClick: (value: BaseCollection) => void;
  selectedCollection?: BaseCollection;
}

export const AstraSidebar = ({ onClick, selectedCollection }: Props) => {
  const [query, setQuery] = useState('');

  const collectionsList = (
    <CollectionList
      query={query}
      selectedCollection={selectedCollection}
      onClick={async (collection) => {
        const { result } = await apiGet(`/collections/${collection.chainId}:${collection.address}`);
        const colt = result as BaseCollection;

        onClick(colt);
      }}
    />
  );

  return (
    <div className="flex flex-col h-full">
      <div className={twMerge(inputBorderColor, 'px-4 py-4 bg-slate-200 border-r')}>
        <DebouncedTextField
          value={query}
          placeholder="Search"
          onChange={(value) => {
            setQuery(value);
          }}
        />
      </div>

      <div className={twMerge(inputBorderColor, 'overflow-y-scroll overflow-x-hidden w-full px-4 border-t')}>
        {collectionsList}
      </div>
    </div>
  );
};
