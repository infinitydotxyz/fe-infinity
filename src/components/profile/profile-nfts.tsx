import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useProfileTokenFetcher } from 'src/components/astra/useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { borderColor, hoverColorBrandText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { EZImage } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { useOrderbook } from '../orderbook/OrderbookContext';

interface Props {
  userAddress: string;
}

export const ProfileNFTs = ({ userAddress }: Props) => {
  const [selectedCollection, setSelectedCollection] = useState<CollectionSearchDto>();
  const { filters, setFilters } = useOrderbook();
  const { isSelected, isSelectable, listMode, toggleSelection, setNumTokens } = useDashboardContext();
  const { data, error, hasNextPage, isLoading, fetch } = useProfileTokenFetcher(userAddress);

  const handleCollectionSearchResult = (result: CollectionSearchDto) => {
    const newFilter = { ...filters };
    newFilter.collections = [result.address];
    setFilters(newFilter);
    setSelectedCollection(result);
  };

  const handleCollectionSearchClear = () => {
    const newFilter = { ...filters };
    newFilter.collections = [];
    setFilters(newFilter);
    setSelectedCollection(undefined);
  };

  return (
    <>
      <div className={twMerge(borderColor, 'flex border-t-[1px]')}>
        <div className="flex px-4 mt-2 w-full">
          <div className="">
            <CollectionSearchInput
              expanded
              profileSearch
              setSelectedCollection={(value) => {
                handleCollectionSearchResult(value);
              }}
            />
          </div>

          {selectedCollection && (
            <div className={twMerge('flex items-center rounded-lg border px-2 ml-2', borderColor)}>
              <div className="flex items-center">
                <EZImage src={selectedCollection.profileImage} className="w-6 h-6 rounded-full mr-2" />
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
          )}
        </div>
      </div>

      <TokenGrid
        listMode={listMode}
        className="px-4 py-4"
        onClick={toggleSelection}
        isSelectable={isSelectable}
        isSelected={isSelected}
        onLoad={setNumTokens}
        data={data}
        isError={!!error}
        hasNextPage={hasNextPage}
        onFetchMore={() => fetch(true)}
        isLoading={isLoading}
      />
    </>
  );
};
