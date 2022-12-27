import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ProfileLayout } from 'src/components/astra/dashboard/profile-layout';
import { ProfileTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export default function ProfileItemsPage() {
  const {
    tokenFetcher,
    isSelected,
    isSelectable,
    gridWidth,
    listMode,
    toggleSelection,
    setTokenFetcher,
    refreshTrigger,
    setNumTokens
  } = useDashboardContext();

  const { chainId } = useOnboardContext();
  const router = useRouter();
  const addressFromPath = router.query?.address as string;

  useEffect(() => {
    if (addressFromPath) {
      setTokenFetcher(ProfileTokenCache.shared().fetcher(addressFromPath, chainId));
    }
  }, [addressFromPath, chainId, refreshTrigger]);

  return (
    <ProfileLayout>
      <TokensGrid
        listMode={listMode}
        tokenFetcher={tokenFetcher}
        className="px-8 py-6"
        onClick={toggleSelection}
        wrapWidth={gridWidth}
        isSelectable={isSelectable}
        isSelected={isSelected}
        onLoad={setNumTokens}
      />
    </ProfileLayout>
  );
}
