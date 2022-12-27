import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CollectionTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export default function ItemsPage(props: DashboardProps) {
  const {
    setNumTokens,
    tokenFetcher,
    isSelected,
    isSelectable,
    gridWidth,
    listMode,
    toggleSelection,
    setTokenFetcher,
    collection,
    refreshTrigger,
    setDisplayName
  } = useDashboardContext();
  const { chainId } = useOnboardContext();

  useEffect(() => {
    if (collection && chainId) {
      setTokenFetcher(CollectionTokenCache.shared().fetcher(collection, chainId));
      setDisplayName(collection?.metadata.name ?? '');
    }
  }, [collection, chainId, refreshTrigger]);

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
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}
