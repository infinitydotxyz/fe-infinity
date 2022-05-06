import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { DebouncedTextField, Divider } from 'src/components/common';
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
    <div className={twMerge('flex flex-col pt-3 h-full items-center bg-slate-100 border-r', inputBorderColor)}>
      <DebouncedTextField
        className="px-4 mb-3"
        value={query}
        placeholder="Search"
        onChange={(value) => {
          setQuery(value);
        }}
      />
      <Divider className="" />
      <div className="overflow-y-auto overflow-x-hidden w-full px-4">{collectionsList}</div>
    </div>
  );
};
