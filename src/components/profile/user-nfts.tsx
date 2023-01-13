import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { DashboardLayout, DashboardProps } from 'src/components/astra/dashboard/dashboard-layout';
import { ProfileTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useProfileTokenFetcher } from 'src/components/astra/useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { borderColor, hoverColorBrandText } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { EZImage } from '../common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { useOrderbook } from '../orderbook/OrderbookContext';

const TokensGridWrapper: FC = () => {
  const { tokenFetcher, isSelected, isSelectable, listMode, toggleSelection, setNumTokens } = useDashboardContext();

  const router = useRouter();
  const addressFromPath = router.query?.address as string;

  const { data, error, hasNextPage, isLoading, fetch } = useProfileTokenFetcher(addressFromPath);

  return (
    <TokenGrid
      listMode={listMode}
      tokenFetcher={tokenFetcher}
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
  );
};

export const UserNFTs = (props: DashboardProps) => {
  const { setTokenFetcher, refreshTrigger } = useDashboardContext();
  const { chainId } = useOnboardContext();
  const router = useRouter();
  const addressFromPath = router.query?.address as string;
  const { filters, setFilters } = useOrderbook();
  const [selectedCollection, setSelectedCollection] = useState<CollectionSearchDto>();

  const handleCollectionSearchResult = (result: CollectionSearchDto) => {
    setSelectedCollection(result);
    const newFilter = { ...filters };
    newFilter.collections = [result.address];
    setFilters(newFilter);
  };

  const handleCollectionSearchClear = () => {
    setSelectedCollection(undefined);
    const newFilter = { ...filters };
    newFilter.collections = [];
    setFilters(newFilter);
  };

  useEffect(() => {
    if (addressFromPath) {
      setTokenFetcher(ProfileTokenCache.shared().fetcher(addressFromPath, chainId));
    }
  }, [addressFromPath, chainId, refreshTrigger]);

  return (
    <DashboardLayout {...props}>
      <div className={twMerge(borderColor, 'w-full flex border-t-[1px]')}>
        <div className="px-4 mt-2">
          <CollectionSearchInput
            expanded
            profileSearch
            setSelectedCollection={(value) => {
              handleCollectionSearchResult(value);
            }}
          />

          {selectedCollection && (
            <div className={twMerge('flex items-center rounded-lg border px-2', borderColor)}>
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
      <TokensGridWrapper />
    </DashboardLayout>
  );
};
