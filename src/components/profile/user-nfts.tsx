import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { ACollectionFilter } from 'src/components/astra/astra-collection-filter';
import { DashboardLayout, DashboardProps } from 'src/components/astra/dashboard/dashboard-layout';
import { ProfileTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useProfileTokenFetcher } from 'src/components/astra/useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const TokensGridWrapper: FC = () => {
  const { tokenFetcher, isSelected, isSelectable, listMode, toggleSelection, setNumTokens } = useDashboardContext();

  const router = useRouter();
  const addressFromPath = router.query?.address as string;

  const { data, error, hasNextPage, isLoading, fetch } = useProfileTokenFetcher(addressFromPath);

  return (
    <TokenGrid
      listMode={listMode}
      tokenFetcher={tokenFetcher}
      className="px-8 py-6"
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

  useEffect(() => {
    if (addressFromPath) {
      setTokenFetcher(ProfileTokenCache.shared().fetcher(addressFromPath, chainId));
    }
  }, [addressFromPath, chainId, refreshTrigger]);

  return (
    <DashboardLayout {...props}>
      <div className={twMerge(borderColor, 'w-full flex   py-2 border-t-[1px]')}>
        <ACollectionFilter />
      </div>
      <TokensGridWrapper />
    </DashboardLayout>
  );
};
