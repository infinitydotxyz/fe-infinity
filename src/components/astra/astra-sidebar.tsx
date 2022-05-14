import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { DebouncedTextField } from 'src/components/common';
import { CollectionSearchDto } from 'src/utils/types/collection-types';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { CollectionCache } from './collection-cache';

interface Props {
  onClick: (value: BaseCollection) => void;
  selectedCollection?: BaseCollection;
}

export const AstraSidebar = ({ onClick, selectedCollection }: Props) => {
  const [query, setQuery] = useState('');

  const handleClick = async (collection: CollectionSearchDto) => {
    const result = await CollectionCache.shared().collection(collection);

    onClick(result);
  };

  const collectionsList = (
    <CollectionList
      query={query}
      selectedCollection={selectedCollection}
      onClick={handleClick}
      onLoad={(collections) => {
        // select first collection
        if (collections.length > 0) {
          handleClick(collections[0]);
        }
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
