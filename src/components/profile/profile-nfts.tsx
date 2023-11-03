import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useProfileTokenFetcher } from 'src/hooks/api/useTokenFetcher';
import { useAppContext } from 'src/utils/context/AppContext';
import { SelectedCollectionType, useProfileContext } from 'src/utils/context/ProfileContext';
import { TokensFilter } from 'src/utils/types';
import { borderColor, hoverColorBrandText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, EZImage } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import TabSelector from '../common/TabSelecter';

interface Props {
  userAddress: string;
  isOwner: boolean;
}

export const ProfileNFTs = ({ userAddress, isOwner }: Props) => {
  const { selectedCollection, setSelectedCollection } = useProfileContext();
  const {
    isNFTSelected,
    isNFTSelectable,
    listMode,
    toggleNFTSelection,
    toggleMultipleNFTSelection,
    selectedProfileTab
  } = useAppContext();
  const { selectedChain } = useAppContext();
  const [filter, setFilter] = useState<TokensFilter>({ hideSpam: false });

  const { data, error, hasNextPage, isLoading, fetch } = useProfileTokenFetcher(userAddress, selectedChain, filter);
  const [numSweep, setNumSweep] = useState('');
  // const [customSweep, setCustomSweep] = useState('');

  useEffect(() => {
    const numToSelect = Math.min(data.length, parseInt(numSweep));
    const tokens = [];
    for (let i = 0; i < numToSelect; i++) {
      tokens.push(data[i]);
    }
    toggleMultipleNFTSelection(tokens);
  }, [numSweep]);

  useEffect(() => {
    fetch(false);
  }, [filter]);

  useEffect(() => {
    if (selectedCollection) {
      handleCollectionSearchResult(selectedCollection);
    } else {
      handleCollectionSearchClear();
    }
  }, [selectedCollection, selectedProfileTab]);

  const handleCollectionSearchResult = (result: SelectedCollectionType) => {
    const newFilter = { ...filter };
    newFilter.collections = [result.address];
    setFilter(newFilter);
    setSelectedCollection(result);
  };

  const handleCollectionSearchClear = () => {
    const newFilter = { ...filter };
    newFilter.collections = [];
    setFilter(newFilter);
    setSelectedCollection(undefined);
  };

  const multiSelect = () => {
    return (
      <TabSelector
        className="mb-0 mt-2.5"
        value={numSweep}
        setValue={setNumSweep}
        tabItems={['5', '10', '20', '50']}
        showCustom
      />
    );
  };
  const [hideSpam, setHideSpam] = useState(false);
  return (
    <>
      <div className="flex flex-col my-3.75 md:my-5 space-y-2 text-sm">
        <div className="md:flex items-center justify-between">
          <div className="flex items-center flex-1 justify-between md:justify-start gap-2.5">
            <CollectionSearchInput
              expanded
              profileSearch
              setSelectedCollection={(value) => {
                const selectedColl: SelectedCollectionType = {
                  address: value.address,
                  name: value.name,
                  imageUrl: value.profileImage
                };
                handleCollectionSearchResult(selectedColl);
              }}
            />
            <div className="hidden md:block">{isOwner && multiSelect()}</div>
            <div className="block md:hidden">
              <Checkbox
                inputClassName="border border-gray-300 dark:border-neutral-200"
                tickMarkClassName="border border-gray-300 dark:peer-checked:text-yellow-700 dark:peer-checked:border-neutral-200 dark:peer-checked:bg-dark-bg"
                boxOnLeft={false}
                label="Hide spam"
                checked={hideSpam}
                onChange={setHideSpam}
              />
            </div>
          </div>
          {/* <Spacer /> */}
          <div className="hidden md:block">
            <Checkbox
              boxOnLeft={false}
              inputClassName="border border-gray-300 dark:border-neutral-200"
              tickMarkClassName="border border-gray-300 dark:peer-checked:text-yellow-700 dark:peer-checked:border-neutral-200 dark:peer-checked:bg-dark-bg"
              label="Hide spam"
              checked={hideSpam}
              onChange={setHideSpam}
            />
          </div>
          <div className="md:hidden block">{isOwner && multiSelect()}</div>
        </div>

        {selectedCollection ? (
          <div className={twMerge('flex items-center rounded-lg border p-2 w-fit', borderColor)}>
            <div className="flex items-center">
              <EZImage src={selectedCollection.imageUrl} className="w-6 h-6 rounded-full mr-2" />
              <div className="text-sm font-medium">{selectedCollection.name}</div>
            </div>
            <div className="ml-2">
              <MdClose
                className={twMerge('h-4 w-4 cursor-pointer', hoverColorBrandText)}
                onClick={() => {
                  handleCollectionSearchClear();
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <TokenGrid
        listMode={listMode}
        // className="md:px-4 py-4"
        onClick={toggleNFTSelection}
        isSelectable={isNFTSelectable}
        isSelected={isNFTSelected}
        data={data}
        isError={!!error}
        hasNextPage={hasNextPage}
        onFetchMore={() => fetch(true)}
        isLoading={isLoading}
      />
    </>
  );
};
