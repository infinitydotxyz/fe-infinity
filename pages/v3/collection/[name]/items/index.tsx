import { GetServerSidePropsContext } from 'next';
import { FC, useEffect } from 'react';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CollectionTokenCache } from 'src/components/astra/token-grid/token-fetcher';
import { TokensGrid } from 'src/components/astra/token-grid/token-grid';
import { useCollectionTokenFetcher } from 'src/components/astra/useFetcher';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const GridWrapper: FC = () => {
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

  const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection?.address);

  return (
    <TokensGrid
      listMode={listMode}
      tokenFetcher={tokenFetcher}
      className="px-8 py-6"
      onClick={toggleSelection}
      wrapWidth={gridWidth}
      isSelectable={isSelectable}
      isSelected={isSelected}
      onLoad={setNumTokens}
      data={data}
      hasNextPage={hasNextPage}
      onFetchMore={() => fetch(true)}
      isError={!!error}
      isLoading={!!isLoading}
    />
  );
};

export default function ItemsPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <GridWrapper />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}
