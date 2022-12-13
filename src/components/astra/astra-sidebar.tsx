import React, { useState, useCallback } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { cardClr, inputBorderColor, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
// import { useLocation } from 'react-router';
// import queryString from 'query-string';
import { CollectionInfo, getCollection } from 'src/utils/astra-utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import debounce from 'lodash/debounce';

interface Props {
  onClick: (value: CollectionInfo) => void;
  onLoad: (value: CollectionInfo) => void;
  selectedCollection?: CollectionInfo;
}

export const AstraSidebar = ({ onClick, onLoad, selectedCollection }: Props) => {
  const [query, setQuery] = useState('');
  // const location = useLocation();

  const { collection } = useDashboardContext();

  const parsedQs = { col: '' }; // queryString.parse(location.search);

  const handleClick = (collection: CollectionInfo, sendOnLoad: boolean) => {
    if (sendOnLoad) {
      onLoad(collection);
    } else {
      onClick(collection);
    }
  };

  const collectionsList = (
    <CollectionList
      query={query}
      selectedCollection={selectedCollection}
      onClick={(c) => handleClick(c, false)}
      onLoad={async (collections) => {
        // select first collection
        if (collections.length > 0 && !collection) {
          let handled = false;

          if (parsedQs.col) {
            const collect = await getCollection(parsedQs.col as string);

            if (collect) {
              handleClick(collect, true);
              handled = true;
            }
          }

          if (!handled) {
            handleClick(collections[0], true);
          }
        }
      }}
    />
  );

  return (
    <div className="flex flex-col h-full mr-2">
      <div className={twMerge(inputBorderColor, 'px-4')}>
        <DbouncedTextField
          value={query}
          placeholder="Search"
          onChange={(value) => {
            setQuery(value);
          }}
        />
      </div>

      <div className={twMerge(inputBorderColor, 'overflow-y-scroll h-full overflow-x-hidden w-full px-4')}>
        {collectionsList}
      </div>
    </div>
  );
};

// ================================================

interface Props3 {
  value: string;
  onChange: (query: string) => void;
  placeholder: string;
  className?: string;
}

export const DbouncedTextField = ({ value, placeholder, onChange, className = '' }: Props3) => {
  const [query, setQuery] = useState(value);

  const handleChange = (value: string) => {
    setQuery(value);
    setQueryDebounced(value);
  };

  // must use useCallback or it doesn't work
  const setQueryDebounced = useCallback(
    debounce((value: string) => {
      onChange(value);
    }, 300),
    []
  );

  return (
    <div className={className}>
      <input
        value={query}
        placeholder={placeholder}
        className={twMerge(
          cardClr,
          textClr,
          'w-full outline-none',
          'rounded-full focus-visible:ring focus:ring-0 py-2 px-4 text-lg lg:text-md leading-5'
        )}
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
};
