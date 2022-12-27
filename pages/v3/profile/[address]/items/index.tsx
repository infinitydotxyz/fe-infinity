import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { ProfileTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { GetServerSidePropsContext } from 'next';

export default function ProfileItemsPage(props: DashboardProps) {
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
    <DashboardLayout {...props}>
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
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.name as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}
