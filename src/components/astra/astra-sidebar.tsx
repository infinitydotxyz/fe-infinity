import { useState } from 'react';
import { CollectionList } from 'src/components/astra/collection-list';
import { DebouncedTextInputBox } from 'src/components/common';
import { inputBorderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
// import { useLocation } from 'react-router';
// import queryString from 'query-string';
import { CollectionInfo, getCollection } from 'src/utils/astra-utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

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
    <div className="flex flex-col h-full">
      <div className={twMerge(inputBorderColor, 'px-4 py-4 border-r-2')}>
        <DebouncedTextInputBox
          label=""
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
